const express = require("express");
const app = express();
const mongoose = require("mongoose");
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

var user = process.env.DB_USER;
var pass = process.env.DB_PASS;
var db = process.env.DB;

const mongoUrl = `mongodb+srv://${user}:${pass}@cluster0.k6zs3.mongodb.net/${db}?retryWrites=true&w=majority`;

mongoose.connect(mongoUrl)
  .then(() => {
    console.log('MongoDB connected');

    const teamSchema = new mongoose.Schema({
      id: Number,
      name: String,
      nationality: String,
      url: String,
    });

    const driverSchema = new mongoose.Schema({
      num: Number,
      code: String,
      forename: String,
      surname: String,
      dob: Date,
      nationality: String,
      url: String,
      team: teamSchema,
    });

    const Team = mongoose.model("Team", teamSchema);
    const Driver = mongoose.model("Driver", driverSchema);

    async function loadDataMiddleware(req, res, next) {
      try {
        const driversCount = await Driver.countDocuments();
        if (driversCount === 0) await loadDataFromCSV();
        next();
      } catch (err) {
        console.error('Error in loadDataMiddleware:', err);
        next(err);
      }
    }

    app.use(loadDataMiddleware);

    async function loadDataFromCSV() {
      return new Promise((resolve, reject) => {
        try {
          const teamsMap = new Map();
          fs.createReadStream('public/data/f1_2023.csv')
            .on('error', reject)
            .pipe(csv())
            .on('data', async (row) => {
              try {
                const cleanedRow = {};
                for (const key in row) {
                  const cleanedKey = key.replace(/^\s+|\s+$/g, '').replace(/[^\x20-\x7E]/g, '');
                  cleanedRow[cleanedKey] = row[key];
                }
                let teamName = cleanedRow.current_team.trim() || 'No Team';
                let teamDoc = teamsMap.get(teamName) || await Team.findOne({ name: teamName }) || new Team({
                  name: teamName,
                  nationality: cleanedRow.nationality.trim(),
                  url: '',
                });
                if (!teamsMap.has(teamName)) {
                  await teamDoc.save();
                  teamsMap.set(teamName, teamDoc);
                }
                const dob = new Date(`${cleanedRow.dob.split('/').reverse().join('-')}`);
                const numValue = parseInt(cleanedRow.number.trim(), 10);
                if (isNaN(numValue)) return;
                let driverExists = await Driver.findOne({ code: cleanedRow.code.trim() });
                if (!driverExists) {
                  await new Driver({
                    num: numValue,
                    code: cleanedRow.code.trim(),
                    forename: cleanedRow.forename.trim(),
                    surname: cleanedRow.surname.trim(),
                    dob,
                    nationality: cleanedRow.nationality.trim(),
                    url: cleanedRow.url.trim(),
                    team: teamDoc,
                  }).save();
                }
              } catch (err) {
                console.error('Error processing row:', err);
              }
            })
            .on('end', resolve);
        } catch (err) {
          console.error('Error in loadDataFromCSV:', err);
          reject(err);
        }
      });
    }

    app.get("/", async (req, res) => {
      const drivers = await Driver.find();
      const teams = await Team.find();
      const nationalities = await Driver.distinct("nationality");
      res.render("index", { drivers, teams, nationalities, driverToEdit: null, viewBy: 'drivers' });
    });

    app.post("/driver", async (req, res) => {
      const { num, code, name, lname, dob, url, nation, team, _id } = req.body;
      const teamDoc = await Team.findOne({ name: team });
      const driverData = {
        num, code: code.trim(), forename: name.trim(), surname: lname.trim(),
        dob, nationality: nation.trim(), url: url.trim(), team: teamDoc,
      };
      if (_id) await Driver.findByIdAndUpdate(_id, driverData);
      else if (!await Driver.findOne({ code: code.trim() })) await new Driver(driverData).save();
      res.redirect("/");
    });

    app.get("/edit/:id", async (req, res) => {
      const driver = await Driver.findById(req.params.id);
      const drivers = await Driver.find();
      const teams = await Team.find();
      const nationalities = await Driver.distinct("nationality");
      res.render("index", { drivers, teams, nationalities, driverToEdit: driver, viewBy: 'drivers' });
    });

    app.get("/delete/:id", async (req, res) => {
      await Driver.findByIdAndDelete(req.params.id);
      res.redirect("/");
    });

    app.get("/toggleView", async (req, res) => {
      const viewBy = req.query.viewBy || 'drivers';
      const data = viewBy === 'teams' ? await Team.find() : await Driver.find();
      const drivers = await Driver.find();
      const teams = await Team.find();
      const nationalities = await Driver.distinct("nationality");
      res.render("index", { drivers, teams, nationalities, data, driverToEdit: null, viewBy });
    });

    app.listen(3000, () => {
      console.log("Listening on port 3000");
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

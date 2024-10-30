require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const axios = require("axios");
const FormData = require("form-data");


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


var key=process.env.DB_KEY;
app.use(express.static("public"));
// https get
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/", (req, res) => {
  const cityName=req.body.cityName;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}&units=metric`;
  https.get(url, (response)=>{
    console.log(response.statusCode);
    var responseContent="";
    response.on("data", (data)=>{
      responseContent+=data;
    }).on("end",()=>{
      /*res.write(responseContent);
      res.send();*/
      const weatherData = JSON.parse(responseContent); 
      const temp = weatherData.main.temp; 
      const description = weatherData.weather[0].description; 
      const icon = weatherData.weather[0].icon; 
      const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      res.send(`
          <h1>The temperature in ${cityName} is ${temp}°C</h1>
          <p>The weather is currently: ${description}</p>
          <img src="${iconUrl}" alt="Weather icon">
          <br><a href="/">Back to Home</a>
      `);
    }).on("error",(e)=>{
      res.send("Error: ${e.message}");
    });
  }); 
});

// https post
app.get("/dictionary", (req, res) => {
  var url = "https://api.toys/api/check_dictionary";
  const form_data = new FormData();
  form_data.append("text", "marry");
  const options = {
    method: "POST",
    headers: form_data.getHeaders(),
  };
  var soapRequest = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      response
        .on("data", (data) => {
          var jsonResp = JSON.parse(data);
          console.log(jsonResp);
          res.send("Success");
        })
        .on("error", (e) => {
          res.send("Error ${e.message}");
        });
    } else {
      res.send("Error");
    }
  });
  form_data.pipe(soapRequest);
});

// axios post
app.get("/temp", (req, res) => {
  var url = "https://api.toys/api/check_dictionary";
  const form_data = new FormData();
  form_data.append("text", "marry");
  axios
    .post(url, form_data, { headers: form_data.getHeaders() })
    .then((response) => {
      var data = response.data;
      console.log(data);
      if (!data.hasOwnProperty("error")) {
        console.log("no error");
        res.send("Success");
      } else {
        console.log("Fail");
        res.send("Fail");
      }
    })
    .catch((err) => {
      console.log(err.code + ": " + err.message);
      console.log(err.stack);
      res.send("Fail error");
    });
});

app.listen(3000, () => {
  console.log("Listening to port 3000");
});

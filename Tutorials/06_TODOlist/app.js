const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const database = {
  default: ["Buy Food", "Cook Food", "Eat Food"],
  work: []
};

app.get("/", (req, res) => {
  const day = date.getDate();
  res.render("list", { listTitle: day, newListItems: database.default });
});

app.post("/", (req, res) => {
  const item = req.body.newItem;
  const listName = req.body.list;

  if (listName === "Work") {
    database.work.push(item);
    res.redirect("/work");
  } else {
    database.default.push(item);
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", newListItems: database.work });
});

app.post("/delete", (req, res) => {
  const listName = req.body.listName;
  const itemIndex = parseInt(req.body.itemIndex, 10);

  if (listName === "Work") {
    database.work.splice(itemIndex, 1);
    res.redirect("/work");
  } else {
    database.default.splice(itemIndex, 1);
    res.redirect("/");
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

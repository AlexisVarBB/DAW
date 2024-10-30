const express = require("express");
const app = express();
const https = require("https");
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
// TODO: configure the express server

const longContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

let postsTitle = [];
let postsContent = [];
let name;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/index.html");
});

app.get("/login", (req, res) => {
  name = req.query.name; 
  res.render("home", { userName: name,postsTitle: postsTitle, 
    postsContent: postsContent  });
});

app.post("/add", (req, res) => {
  let newPostT=req.body.title;
  let newPostC=req.body.content;
  postsTitle.push(newPostT);
  postsContent.push(newPostC);
  res.render("home", { 
    userName: name, 
    postsTitle: postsTitle, 
    postsContent: postsContent 
  });
});

app.get("/post/:postId", (req, res) => {
  const postId = req.params.postId; 
  const postTitle = postsTitle[postId];
  const postContent = postsContent[postId];
  res.render("post", { postId: postId, postTitle: postTitle, postContent: postContent });
});

app.post("/edit/:postId", (req, res) => {
  const postId = req.params.postId;
  postsTitle[postId] = req.body.title;
  postsContent[postId] = req.body.content;
  res.redirect("/login"); 
});

app.post("/delete/:postId", (req, res) => {
  const postId = req.params.postId;
  postsTitle.splice(postId, 1);
  postsContent.splice(postId, 1);
  res.redirect("/login"); 
});



app.listen(3000, (err) => {
  console.log("Listening on port 3000");
});

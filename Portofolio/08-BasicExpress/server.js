const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.route('/')
  .get((req,res)=>{
    res.sendFile(__dirname + '/index.html');
  })
  .post((req,res)=>{
    var weight=req.body.weight;
    var height=req.body.height;
    res.send("Your BMI is "+(weight/((height/100)*(height/100))));
  });

app.listen(3000, () =>{
    console.log("Application listening port 3000");
  });
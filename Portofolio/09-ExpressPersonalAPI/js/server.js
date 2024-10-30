const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var names=[];
app.route('/')
  .get((req,res)=>{
    //res.sendFile(__dirname + '/index.html');
    res.render('index', { names: names, error: null });
  })
  .post((req,res)=>{
  });

  app.get('/greet', (req, res) => {
    const name = req.query.name;
    if (name) {
        names.push(name); 
      }
    res.render('index', { names: names, error: null });
    //res.render('wazzup', { name: name });
  });

  app.get('/greet/:name', (req, res) => {
    const name = req.params.name;
  
    res.render('wazzup', { name: name });
  });
app.listen(3000, () =>{
    console.log("Application listening port 3000");
  });
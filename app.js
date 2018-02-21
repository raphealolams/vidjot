const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Map Mongoose promise to global promise
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/vidjot-dev' , {
  useMongoClient: true
})
.then(() => {
  console.log('Database Connected')
})
.catch(err => console.log(err))

// Load Models
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Middleware for Handlebars
app.engine('handlebars' , exphbs({
  defaultLayout: 'main'
}));
app.set('view engine' , 'handlebars');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/' , (req , res) => {
  res.render('index')
})

// Add Ideas
app.get('/ideas/add' , (req , res) => {
  res.render('ideas/add')
})

// Process Form
app.post('/ideas' , (req , res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({text: 'Please Enter Some Title'})
  }
  if(!req.body.details){
    errors.push({text: 'Please Enter Some details'})
  }
  if(errors.length > 0){
    res.render('ideas/add' , {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    })
  } else{
    const newIdea = {
      title: req.body.title,
      details: req.body.details
    }

    new Idea(newIdea)
      .save()
      .then( idea => {
        res.redirect('/ideas')
    })
  }
})

const port = 8080;
app.listen(port , () => {
  console.log(`App Started On port ${port}`);
})


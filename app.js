const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('flash');
const session = require('express-session');
const methodOverride = require('method-override');
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

// express session middleware
app.use(session({
  secret: 'keyboard',
  resave: true,
  saveUninitialized: true,
}))

// Flash usage

// override with POST having ?_method=DELETE
// middleware
app.use(methodOverride('_method'))

app.get('/' , (req , res) => {
  res.render('index')
})

app.get('/ideas' , (req , res) => {
  Idea.find({})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index' , {
        ideas
      })
    })
})

// Add Ideas
app.get('/ideas/add' , (req , res) => {
  res.render('ideas/add')
})

// Edit Idea
app.get('/ideas/edit/:id' , (req , res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      res.render('ideas/edit' , {
        idea
      })
    })
  
 
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

app.put('/ideas/:id' , (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then((idea) => {
      idea.title = req.body.title;
      idea.details = req.body.details;

      idea.save()
        .then(idea => {
          res.redirect('/ideas')
        })
      
    })
})

app.delete('/ideas/:id' , (req, res) => {
  Idea.remove({
    _id: req.params.id
  })
    .then(() => {
      res.redirect('/ideas')      
    })
})

const port = 8080;
app.listen(port , () => {
  console.log(`App Started On port ${port}`);
})


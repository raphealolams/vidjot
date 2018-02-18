const express = require('express');
const exphbs = require('express-handlebars');

const app = express();


// Middleware for Handlebars
app.engine('handlebars' , exphbs({
  defaultLayout: 'main'
}));
app.set('view engine' , 'handlebars');

app.use((req , res, next) => {
  console.log(Date.now());

  next();
})

app.get('/' , (req , res) => {
  res.render('index')
})


const port = 8080;
app.listen(port , () => {
  console.log(`App Started On port ${port}`);
})


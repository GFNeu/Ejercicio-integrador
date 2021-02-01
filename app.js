const express = require('express');
const app = express();
const db = require('./db');          
const morgan = require('morgan');
const chalk = require('chalk');
const routes = require('./routes');
const port= 3000

app.use(morgan('tiny'));

app.use(express.urlencoded({extended: false})); //HTML form submits
app.use(express.json());//AJAX requests

//Si tuviese archivos estáticos:
//app.use(express.static(path.join(__dirname, '/public')));

app.use(routes)

// error middleware -> https://expressjs.com/es/guide/error-handling.html
app.use((err, req, res, next) => {
    res.status(404).send(err.message);
    console.log(err)
    //res.sendStatus(404).send(err);
  })

//Conectando a través de sequelize con postgress y sincronizando
db.sync() //{force: true}
  .then(()=>{
    console.log(chalk.green('Conected to db!'))
    app.listen(port, ()=> console.log(chalk.blue(`You are listening on http://localhost:${port}`)))
  })
  .catch(console.error);



const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const Joi = require('joi');
const logger = require('./middleware/logger');

const courses = require('./routes/courses');
const home = require('./routes/home');

const app = express();

app.use(express.json()); //req.body
app.use(express.urlencoded({extended:true}));// support form data
app.use(express.static('public')); //adds public folder no public folder not in URL
app.get(helmet());
app.use(morgan('tiny'));


app.use(logger);
app.use('/api/courses', courses);
app.use('/', home);

// Configuration
// console.log("app name: "+config.get('name'));
// console.log('mail server: '+config.get('mail.host'));


// URL way
app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.params);
});

// Query string way
app.get('/api/posts/', (req, res) => {
    res.send(req.query);
});


app.listen(3000, () => {
    console.log('Listening on 3000');
});
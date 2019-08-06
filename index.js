const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const Joi = require('joi');
const logger = require('./logger');

const app = express();

app.use(express.json()); //req.body
app.use(express.urlencoded({extended:true}));// support form data
app.use(express.static('public')); //adds public folder no public folder not in URL
app.get(helmet());

app.use(logger);






// Configuration
console.log("app name: "+config.get('name'));
console.log('mail server: '+config.get('mail.host'));


app.use(function(req, res, next){
    console.log('Authenticating...');
    next();
});

var courses = [
    {id:1, name: "course1"},
    {id:2, name: "course2"}
];

app.get('/', (req, res) => {
    res.send("Hello world");
});

app.get('/api/courses', (req, res) =>{
    res.send(courses);
});


app.get('/api/courses/:id', (req, res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send("course not found");
        return;
    }
    else{
        res.send(course);
    }
});

app.post('/api/courses/', (req, res) => {

    const {error} = validateCourse(req.body); //result.error

    if(error) return res.status(400).send(error.details[0].message);
        


    
    const course = {
        id: courses.length+1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});


app.put('/api/courses/:id', (req, res) => {
    // Look up the course
    // if not existing 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send("course not found");
        return;
    }   

    // validate
    // if invalid 400
    
    const {error} = validateCourse(req.body); //result.error

    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    // updated course
    course.name = req.body.name;
    // return the update
    res.send(course);

});

app.delete('/api/courses/:id', (req, res) => {
    // Lookup
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
        res.status(404).send("Course not found");
        return;
    }

    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
});

function validateCourse(course) {
    const schema = {
        name : Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}







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
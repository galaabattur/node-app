const express = require('express');
const router = express.Router();

const Joi = require('joi');

var courses = [
    {id:1, name: "course1"},
    {id:2, name: "course2"}
];

router.get('/', (req, res) =>{
    res.send(courses);
});


router.get('/:id', (req, res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send("course not found");
        return;
    }
    else{
        res.send(course);
    }
});

router.post('/', (req, res) => {

    const {error} = validateCourse(req.body); //result.error

    if(error) return res.status(400).send(error.details[0].message);
    
    const course = {
        id: courses.length+1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});


router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

module.exports = router;
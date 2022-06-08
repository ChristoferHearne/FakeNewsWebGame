/**
* Exported functions for all endpoints related to the university-schema
* @extends Mongoose
*/
const universities = require('../models/university.js')

exports.getAllUniversities = (req, res) => {
    universities.find(function(err, universities){
        if(err){
          res.send(err)
        }
        res.json(universities)
      })
}

exports.registerUniversity = (req, res) => {
    universities.findOneAndUpdate({_id: req.params._id}, {$inc : {'amountRegistered' : 1}}, {
    }, function(err, university){
      if(err){
        res.status(401).send(err)
      }
      if(university == null){
        res.status(404).json({Error: `Could not find this _id in the collection of universities`})
      }
      else{
        res.status(201).json({Message: `University was updated successfully`})
      }
    })
}

exports.unRegisterUniversity = (req, res) => {
    universities.findOneAndUpdate({_id: req.params._id}, {$inc : {'amountRegistered' : -1}}, {
    }, function(err, university){
      if(err){
        res.status(401).send(err)
      }
      if(university == null){
        res.status(404).json({Error: `Could not find this _id in the collection of universities`})
      }
      else{
        res.status(201).json({Message: `University was updated successfully`})
      }
    })
}
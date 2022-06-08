/**
* Exported functions for all endpoints related to the employment-schema
* @extends Mongoose
*/
const employments = require('../models/employment.js')

exports.getAllEmployments = (req, res) => {
    employments.find(function(err, employments){
        if(err){
          res.status(401).send(err)
        }
        res.status(201).json(employments)
      })
}

exports.registerEmployment = (req, res) => {
    employments.findOneAndUpdate({_id: req.params._id}, {$inc : {'amountRegistered' : 1}}, {
    }, function(err, employment){
      if(err){
        res.send(err)
      }
      if(employment == null){
        res.status(404).json({Error: `Could not find this employmentID in the collection of employments`})
      }
      else{
        res.status(201).json({Message: `Employment was updated successfully`})
      }
    })
}

exports.unRegisterEmployment = (req, res) => {
    employments.findOneAndUpdate({_id: req.params._id}, {$inc : {'amountRegistered' : -1}}, {
    }, function(err, employment){
      if(err){
        res.status(401).send(err)
      }
      if(employment == null){
        res.status(404).json({Error: `Could not find this employmentID in the collection of employments`})
      }
      else{
        res.status(201).json({Message: `Employment was updated successfully`})
      }
    })
}
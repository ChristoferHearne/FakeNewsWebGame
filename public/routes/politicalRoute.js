/**
* Exported functions for all endpoints related to the political-schema
* @extends Mongoose
*/
const politicals = require('../models/political.js')

exports.getAllPoliticals = (req, res) => {
    politicals.find(function(err, politicals){
        if(err){
          res.status(401).send(err)
        }
        res.status(201).json(politicals)
    })
}

exports.registerPolitical = (req, res) => {
    politicals.findOneAndUpdate({_id: req.params._id}, {$inc : {'amountRegistered' : 1}}, {
    }, function(err, political){
      if(err){
        res.status(401).send(err)
      }
      if(political == null){
        res.status(404).json({Error: `Could not find this _id in the collection of political leanings`})
      }
      else{
        res.status(201).json({Message: `Political was updated successfully`})
      }
    })
}

exports.unRegisterPolitical = (req, res) => {
    politicals.findOneAndUpdate({_id: req.params._id}, {$inc : {'amountRegistered' : -1}}, {
    }, function(err, political){
      if(err){
        res.status(401).send(err)
      }
      if(political == null){
        res.status(404).json({Error: `Could not find this _id in the collection of political leanings`})
      }
      else{
        res.status(201).json({Message: `Political was updated successfully`})
      }
    })
}
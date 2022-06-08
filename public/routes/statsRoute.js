/**
* Exported functions for all endpoints related to the statistics-schema
* @extends Mongoose
*/

const statistics = require('../models/statistics.js')

exports.getAllStats = (req, res) => {
    statistics.find(function(err, stats){
        if(err){
          res.status(401).send(err)
        }
        res.status(201).json(stats)
    })
}

exports.updateStats = (req, res) => {
    statistics.updateOne({}, {$inc : {'roundsPlayed' : 10, 'amountRight': req.body.rightAnswers, 'amountWrong': req.body.wrongAnswers}}, {
    }, function(err, stats){
      if(err){
        res.status(401).send(err)
      }
      else{
        res.status(201).json({Message: `Statistics was updated successfully`})
      }
    })
}
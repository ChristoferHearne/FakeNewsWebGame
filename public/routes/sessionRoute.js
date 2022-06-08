/**
* Exported functions for all endpoints related to the session-schema
* @extends Mongoose
*/
const sessions = require('../models/session.js')
const players = require('../models/player.js')
const mongoose = require('mongoose')

exports.getAllSessions = (req, res) => {
    sessions.find()
      .populate('player')
      .exec((err, sessions) => {
      if(err){
        res.status(401).send(err)
      }
      res.status(201).json(sessions)
  })
}

exports.getLatestSessions = (req, res) => {
    sessions.find()
        .sort({_id: -1})
        .populate('player')
        .limit(10).exec((err, latest) => {
          if(err){
            res.status(401).send(err)
          }
          res.status(201).json(latest)
        })
}

exports.getSessionById = (req, res) => {
      sessions.findById(req.params._id)
        .populate('player').exec((err, sessionInfo) => {
        if(err){
            res.status(401).send(err)
        }
        res.status(201).json(sessionInfo)
  })
}

exports.addGameSession = (req, res) => {
    if(req.body.player != null){
        players.findById(req.body.player._id, function(err, playerInfo){
          if(err){
            res.status(401).send(err)
          }
          if(playerInfo == null){
            res.status(404).json({Error: `Could not find a player with that _id`})
          }
            var newSession = new sessions({
              _id: new mongoose.Types.ObjectId(),
              player: playerInfo,
              gameResult: req.body.gameResults,
              timestamp: req.body.timestamp
            })
          
            newSession.save(function (err){
              if(err){
                res.status(401).send(err)
              }
            })
            res.status(201).json(newSession)
        })
      }
      else{
        var newSession = new sessions({
          _id: new mongoose.Types.ObjectId(),
          player: null,
          gameResult: req.body.gameResults,
          timestamp: req.body.timestamp
        })
      
        newSession.save(function (err){
          if(err){
            res.status(401).send(err)
          }
        })
        res.status(201).json(newSession)
      }
}

exports.deleteSession = (req, res) => {
    sessions.deleteOne({_id: req.params._id}, function(err, session){
        if(err){
          res.status(401).send(err)
        }
        if(session == null){
          res.status(404).json({Error: `Could not delete session, the _id does not exist in the colletion`})
        }
        else{
          res.status(201).json({Message: "Session was deleted"})
        }
      })
}
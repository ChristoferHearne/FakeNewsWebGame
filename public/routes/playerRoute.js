/**
* Exported functions for all endpoints related to the player-schema
* @extends Mongoose
*/
const players = require('../models/player.js')
const sessions = require('../models/session.js')
const mongoose = require('mongoose')

exports.getAllPlayers = (req, res) => {
  players.find()
    .sort({_id: -1})
    .populate('university')
    .populate('employment')
    .populate('political').exec((err, players) =>{
      if(err){
        res.status(401).send(err)
      }
      res.status(201).json(players)
    })
}

exports.findPlayerById = (req, res) => {
    players.findById(req.params._id)
    .populate('university')
    .populate('employment')
    .populate('political').exec((err, player) => {
      if(err){
        res.status(401).send(err)
      }
      if (player == null){
        res.status(404).json({Error: `Could not find a player with that _id`})
      }
      res.status(201).json(player)
    })
}

exports.addPlayer = (req, res) => {
    const _id = new mongoose.Types.ObjectId()
  const username = req.body.username
  const age = req.body.age
  const city = req.body.city
  const employment = req.body.employment
  const university = req.body.university
  const politicalLeaning = req.body.political

  players.findOne({username: username}, function (err, userName){
    if (err){
      res.status(401).send(err)
    }
    if (userName != null){
      res.status(402).json({Error: `Username ${username} is already taken, please pick another one`})
      return
    }
    else{
      var newPlayer = new players()
      newPlayer._id = _id
      newPlayer.username = username
      newPlayer.age = age
      newPlayer.city = city
      newPlayer.employment = employment
      newPlayer.university = university
      newPlayer.political = politicalLeaning
      newPlayer.save(function (err){
        if (err){
          res.status(401).send(err)
        }
      })
      res.status(201).json(newPlayer)
    }
  })
}

exports.updatePlayer = (req, res) => {
    const putRequest = {
        username: req.body.username,
        age: req.body.age,
        city: req.body.city,
        employment: req.body.employment,
        university: req.body.university, 
        political: req.body.political
      }
      players.findOneAndUpdate({_id: req.params._id}, putRequest, {
      }, function(err, player){
        if(err){
          res.status(401).send(err)
        }
        if(player == null){
          res.status(404).json({Error: `Could not find this _id in the collection of players`})
        }
        else{
          res.status(201).json({Message: `Player was updated successfully`})
        }
      })
}

exports.deletePlayer = (req, res) => {
    players.deleteOne({_id: req.params._id}, function(err, player){
        if(err){
          res.status(401).send(err)
        }
        if(player == null){
          res.status(404).json({Error: `Could not delete player, the playerID does not exist in the colletion`})
        }
        else{
          res.status(201).json({Message: "Player was deleted"})
          sessions.updateOne({player: req.params._id}, {player: null}, 
            function(err, session){
              if(err){
                console.log(err)
              }
              if(session == null){
                console.log("Session could not be found")
              }
              else{
                console.log("Player was deleted from the session")
              }
            })
        }
      })
}
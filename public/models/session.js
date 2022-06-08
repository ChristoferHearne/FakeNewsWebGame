/**
* A mongoose schema for a separate session in the game. Uses foreign keys player_id and article_id for each round played
* @extends Mongoose
*/
var mongoose = require('mongoose')
var schema = mongoose.Schema

var sessionSchema = new schema({
    _id: schema.Types.ObjectId,
    player: {type: schema.Types.ObjectId, ref: 'Player'},
    gameResult: [{
        roundNumber: Number,
        article: {type: schema.Types.ObjectId, ref: 'Article'},
        answer: Number
    }],
    timestamp: String 
},
{
    collection: "sessions",
    versionKey: false
})

module.exports = mongoose.model("Sessions", sessionSchema)

/**
* A mongoose schema for a player in the game, holds foreign keys university_id, employment_id and political_id
* @extends Mongoose
*/
var mongoose = require('mongoose')
var schema = mongoose.Schema

var playerSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    age: Number, 
    city: String, 
    employment: {type: schema.Types.ObjectId, ref: 'Employment'},
    university: {type: schema.Types.ObjectId, ref: 'University'}, 
    political: {type: schema.Types.ObjectId, ref: 'Political'}
},
{
    collection: "players",
    versionKey: false
})
const player = mongoose.model("Player", playerSchema)
module.exports = player
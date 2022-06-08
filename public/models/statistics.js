/**
* A mongoose schema for getting the total statistics for all sessions 
* @extends Mongoose
*/
var mongoose = require('mongoose')
var schema = mongoose.Schema

var statsSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    roundsPlayed: Number,
    amountRight: Number,
    amountWrong: Number
},
{
    collection: "statistics",
    versionKey: false
})
const stats = mongoose.model("Statistics", statsSchema)
module.exports = stats
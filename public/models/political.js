/**
* A mongoose schema for the political leanings available in the game
* @extends Mongoose
*/
var mongoose = require('mongoose')
var schema = mongoose.Schema

var politicalSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    amountRegistered: Number 
},
{
    collection: "political",
    versionKey: false
})
const political = mongoose.model("Political", politicalSchema)
module.exports = political
/**
* A mongoose schema for the universities available in the game
* @extends Mongoose
*/
var mongoose = require('mongoose')
var schema = mongoose.Schema

var universitySchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    amountRegistered: Number 
},
{
    collection: "universities",
    versionKey: false
})
const university = mongoose.model("University", universitySchema)
module.exports = university
/**
* A mongoose schema for the employment statuses available in the game
* @extends Mongoose
*/
var mongoose = require('mongoose')
var schema = mongoose.Schema

var employmentSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    amountRegistered: Number 
},
{
    collection: "employment",
    versionKey: false
})
const employment = mongoose.model("Employment", employmentSchema)
module.exports = employment
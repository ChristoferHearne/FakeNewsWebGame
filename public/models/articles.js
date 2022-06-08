/**
* A mongoose schema for the articles present in the game
* @extends Mongoose
*/

var mongoose = require('mongoose')
var schema = mongoose.Schema

var articleSchema = new schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    text: String, 
    subject: String, 
    date: String, 
    status: String
},
{
    collection: "articles",
    versionKey: false
})

const article = mongoose.model("Articles", articleSchema)
module.exports = article

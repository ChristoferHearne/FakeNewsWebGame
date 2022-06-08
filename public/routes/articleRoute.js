/**
* Exported functions for all endpoints related to the article-schema
* @extends Mongoose
*/
const articles = require('../models/articles.js')

exports.getAllArticles = (req, res) => {
    articles.find(function(err, articles){
        if(err){
          res.status(401).send(err)
        }
        res.status(201).json(articles)
      })
}

exports.getRandomArticle = (req, res) => {
  articles.aggregate([{$sample: {size: 1}}], function (err,article){
    if(err){
      res.status(401).send(err)
    }
    if(article == null){
      res.status(404).json({Error: `A randomized article could not be found`})
    }
    else{
      res.status(201).json(article)
    }
  })
}

exports.getArticleById = (req, res) => {
  articles.findById(req.params._id, (err, article) => {
    if(err){
      res.status(401).send(err)
    }
    if(article == null){
      res.status(404).json({Error: `Could not find an article with that _id`})
    }
    else{
      res.status(201).json(article)
    }
  })
}
/**
* Backend for the solution. Uses MongoDB Atlas database. 
* @extends Express
*/
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const articleRouter = require('./public/routes/articleRoute.js')
const universityRouter = require('./public/routes/universityRoute.js')
const politicalRouter = require('./public/routes/politicalRoute.js')
const employmentRouter = require('./public/routes/employmentRoute.js')
const statsRouter = require('./public/routes/statsRoute.js')
const playerRouter = require('./public/routes/playerRoute.js')
const sessionRouter = require('./public/routes/sessionRoute.js')

const app = express()

// Database connection
mongoose.connect('mongodb+srv://chhe1903:dt190gDB@dt190g.sauuu.mongodb.net/projectDB?authSource=admin&replicaSet=atlas-uw90e6-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true', {useNewUrlParser: true});
let db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))

db.once('open', function (callback) {
  console.log("Connected to db"); // Connected to database
});

// Express configurations
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log(`Server is running on port ${port}`)
});

// Indents the JSON-data by 2 spaces
app.set('json spaces', 2)

// GET - Retrieves all articles stored in the API
app.get("/api/articles", (req, res) => {
  articleRouter.getAllArticles(req, res)
})

// GET - Retrieves a randomized article from the articles-collection, used in each round of the game
app.get("/api/articles/session", (req, res) => {
  articleRouter.getRandomArticle(req, res)
})

// GET - Retrieves a specific article based on its _id property
app.get("/api/articles/:_id", (req, res) => {
  articleRouter.getArticleById(req, res)
})

// GET - Retrieves all universities from the collection
app.get("/api/universities", (req, res) => {
  universityRouter.getAllUniversities(req, res)
})

// PUT - Updates a specific university by incrementing its amountRegistered by 1. Is used when a player is created or updated
app.put("/api/universities/register/:_id", (req, res) => {
  universityRouter.registerUniversity(req, res)
})

// PUT - Updates a university by subtracting amountRegistered by 1. Is used when a player updates their university or deletes the player entirely
app.put("/api/universities/unregister/:_id", (req, res) => {
  universityRouter.unRegisterUniversity(req, res)
})

// GET - Retrieves all political leanings
app.get("/api/politicals", (req, res) => {
  politicalRouter.getAllPoliticals(req, res)
})

// PUT - Updates a specific political leaning by incrementing its amountRegistered by 1. Is used when a player is created or updated
app.put("/api/politicals/register/:_id", (req, res) => {
  politicalRouter.registerPolitical(req, res)
})

// PUT - Updates a specific political leaning by subtracting amountRegistered by 1. Is used when a player is updated or deleted
app.put("/api/politicals/unregister/:_id", (req, res) => {
  politicalRouter.unRegisterPolitical(req, res)
})

// GET - Gets all employment statuses
app.get("/api/employments", (req, res) => {
  employmentRouter.getAllEmployments(req, res)
})

// PUT - Updates a specific employment status by incrementing its amountRegistered by 1. Is used when a player is created or updated
app.put("/api/employments/register/:_id", (req, res) => {
  employmentRouter.registerEmployment(req, res)
})

// PUT - Updates a specific employment status by subtracting amountRegistered by 1. Is used when a player is updated or deleted
app.put("/api/employments/unregister/:_id", (req, res) => {
  employmentRouter.unRegisterEmployment(req, res)
})

// GET - Retrieves all live statistics from the collection
app.get("/api/statistics", (req, res) => {
  statsRouter.getAllStats(req, res)
})

// PUT - Updates the total stats for all game sessions. Is incremented by rounds played and amount of right and wrong answers
app.put("/api/statistics", (req, res) => {
  statsRouter.updateStats(req, res)
})

// GET - Retrieves all players from the players-collection, populates foreign keys university, employment and political
app.get("/api/players", (req, res) => {
  playerRouter.getAllPlayers(req, res)
})

// GET - Retrieves a player with a certain _id
app.get("/api/players/:_id", (req, res) => {
  playerRouter.findPlayerById(req, res)
})

// POST - Adds a new player to the players-collection
app.post("/api/players", (req, res) => {
  playerRouter.addPlayer(req, res)
})

// PUT - Updates a specific players information
app.put("/api/players/:_id", (req, res) => {
  playerRouter.updatePlayer(req, res)
})

// DELETE - Removes a specific player and removes the player_id from the players sessions. Session is still stored
app.delete("/api/players/:_id", (req, res) =>{
  playerRouter.deletePlayer(req, res)
})

// GET - Retrieves all sessions in the sessions-collection, populates the player_id
app.get("/api/sessions", (req, res) => {
  sessionRouter.getAllSessions(req, res)
})

// GET - Retrieves the 10 latest sessions played. Used in the admin-dashboard
app.get("/api/sessions/latest", (req, res) => {
  sessionRouter.getLatestSessions(req, res)
})

// GET - Gets a specific session with populated player-info
app.get("/api/sessions/:_id", (req, res) => {
  sessionRouter.getSessionById(req, res)
})


// POST - Creates a new gamesession with foreign key player_id attached
app.post("/api/sessions", (req, res) => {
  sessionRouter.addGameSession(req, res)
})


// DELETE - Removes the gamesession from the collection
app.delete("/api/sessions/:_id", (req, res) =>{
  sessionRouter.deleteSession(req, res)
})




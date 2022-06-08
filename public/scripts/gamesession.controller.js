/**
* Angular controller that manages the game session
* @extends Angular
*/
angular.module('gameSessionController', []) // Läs 1 nedan
    .controller('GameSessionController',  function GameSessionController($scope, $http, $state, playerService, sessionService) { // Läs 2 nedan
        // Instance variables
        $scope.roundCounter = 0; 
        $scope.currentPlayer = playerService.getCurrentPlayer()
        $scope.gameResults = []
        $scope.userName = $scope.currentPlayer != null ? $scope.currentPlayer.username : "No player registered" // Sets the username based on the session having a player or not
        $scope.newsPaperHeading = "The Daily Prophet"

        // Retrieves a random article from the API, endpoint uses aggregate to send one article randomly from the collection
        $scope.getRandomArticle = function(){
            $http.get('/api/articles/session') 
                .then(function successCallback(response){
                    $scope.currentArticle = response.data[0] // The article that the user gets for the current round

            },
                function errorCallback(response){
                    console.log(`Error getting the article for this round: ${JSON.stringify(response)}`)
                })
        }

        // Registers the answer when the player clicks "Real"
        $scope.registerRealNewsAnswer = function(){
            if($scope.roundCounter === 10){ // If the player has played 10 rounds 
                $scope.finishGame() // Finish the game and register the session
            }
            else{
                // Push the result of the round to the gameResults array
                if ($scope.currentArticle.status == "TRUE"){ // If the player guessed correctly
                    $scope.gameResults.push(
                        {
                            roundNumber: $scope.roundCounter,
                            article: $scope.currentArticle._id,
                            answer: 1
                        }
                    )
                }
                else{
                    // If the answer was wrong
                    $scope.gameResults.push(
                        {
                            roundNumber: $scope.roundCounter,
                            article: $scope.currentArticle._id,
                            answer: 0
                        }
                    )
                }
                $scope.roundCounter += 1
                $scope.getRandomArticle() // Gets new article for the next round
            }
        }
        // Registers the answer when the player clicks "Real"
        $scope.registerFakeNewsAnswer = function(){
            if ($scope.roundCounter === 10){
                $scope.finishGame() // Finish the game and register the session
            }
            else{
                if ($scope.currentArticle.status == "FAKE"){ // If the player guessed correctly
                    $scope.gameResults.push(
                        {
                            roundNumber: $scope.roundCounter,
                            article: $scope.currentArticle._id,
                            answer: 1
                        }
                    )
                }
                else{
                    // If the answer was wrong
                    $scope.gameResults.push(
                        {
                            roundNumber: $scope.roundCounter,
                            article: $scope.currentArticle._id,
                            answer: 0
                        }
                    )
                }
                $scope.roundCounter += 1
                $scope.getRandomArticle() // Gets new article for the next round
            }
        }

        // Adds the session to the sessions-collection and takes the player to the results-page
        $scope.finishGame = function(){
            var currentDate = new Date()
            var timestamp = `${currentDate.toLocaleDateString('sv-SE')} ${currentDate.toLocaleTimeString('sv-SE')}` // Timestamp in swedish local to be added to the timestamp-field

            // Post-request
            $scope.sessionInfo = {
                player: $scope.currentPlayer,
                gameResults: $scope.gameResults,
                timestamp: timestamp
            }

            // Adds a new session to the sessions-collection
            $http.post('/api/sessions', $scope.sessionInfo) 
                .then(function successCallback(response){
                    console.log(`The session was registered successfuly: ${JSON.stringify(response)}`)

                    sessionService.setCurrentSession(response.data) // Uses the callback data to set the session that was just played in the service
                    $state.go('results') // Navigate to the results-page
            },
                function errorCallback(response){
                    console.log(`Error registering current round: ${JSON.stringify(response)}`)
                })
        }

        $scope.getRandomArticle() // Gets random article on init
    }
)
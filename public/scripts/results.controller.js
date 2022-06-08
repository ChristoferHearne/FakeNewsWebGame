/**
* Angular controller that manages the Results-view when a player has finished a game
* @extends Angular
*/
angular.module('resultsController', []) // Läs 1 nedan
    .controller('ResultsController', function ResultsController($scope, $http, playerService, sessionService) {
        // Instance variables
        $scope.currentSession = sessionService.getCurrentSession() // Gets the information attached to the current session
        $scope.newsPaperHeading = "The Daily Prophet"

        // Sets select-elements if the player wants to make changes to their info
        $scope.setSelectOptions = function(){
            $http.get('/api/universities') 
                .then(function successCallback(response){
                    $scope.universities = response.data

            },
            function errorCallback(response){
                console.log(`Error getting the article for this round: ${JSON.stringify(response)}`)
            })
            $http.get('/api/politicals') 
                .then(function successCallback(response){
                    $scope.politicalLeanings = response.data

        },
            function errorCallback(response){
                console.log(`Error getting the article for this round: ${JSON.stringify(response)}`)
            })
            $http.get('/api/employments') 
                .then(function successCallback(response){
                    $scope.employmentStatuses = response.data

        },
            function errorCallback(response){
                console.log(`Error getting the article for this round: ${JSON.stringify(response)}`)
            })
        }

        // Calculates the game results of the game
        $scope.setSessionData = function(){
            $scope.totalRightAnswers = 0 
            $scope.totalWrongAnswers = 0

            $scope.gameResults = $scope.currentSession.gameResult
            if ($scope.gameResults != undefined){
                for(let i = 0; i < $scope.gameResults.length; i++){ // Checks if the answer was right and gets the articles for each round
                    if($scope.gameResults[i].answer === 1){
                        $scope.totalRightAnswers += 1
                    }
                    else{
                        $scope.totalWrongAnswers += 1
                    }
                    $http.get('/api/articles/' + $scope.gameResults[i].article) 
                        .then(function successCallback(response){
                            $scope.gameResults[i].article = response.data.title
                    },
                        function errorCallback(response){
                            console.log(`Error getting the article for this round: ${JSON.stringify(response)}`)
                        })
                }

                // Adds game result to the total statistics
                $http.put('/api/statistics', {rightAnswers: $scope.totalRightAnswers, wrongAnswers: $scope.totalWrongAnswers})
                    .then(function successCallback(response){
                        console.log(`Success: ${JSON.stringify(response)}`)
                    },
                    function errorCallBack(response){
                        console.log(`Error: ${JSON.stringify(response)}`)
                    })
            }
        }

        // Checks if there was a player for the session. If player was not registered, inform the user
        $scope.getCurrentPlayer = function(){
            if (playerService.getCurrentPlayer() != null){ // If there was a player registered
                $http.get('/api/sessions/' + $scope.currentSession._id) 
                        .then(function successCallback(response){
                            $scope.playerInfo = response.data.player
                    },
                        function errorCallback(response){
                            console.log(`Error getting the player for this round: ${JSON.stringify(response)}`)
                        })
            }
            else{ // If there was no player registered
                
                const playerFormElements = document.getElementById('player-form').children // Player-form elements
                playerFormElements[1].innerHTML = `Since you did not register a player, there is no player attached to this game-session` // Set player information
                        
                for (let i = 2; i < playerFormElements.length; i++){ // Remove all other elements from the playerform
                    playerFormElements[i].style.display = "none"
                }
            }
        }

        // Render a icon based on the answer being wrong or correct
        $scope.setAnswerStatus = function(answer){
            switch(answer){
                case 0: 
                    return `<p class="answer-heading"><i class="fas fa-times"></i>Wrong</p>`
                case 1:
                    return `<p class="answer-heading"><i class="fas fa-check"></i>Right</p>`
                default: 
                    return ''
            }
        }

        // Makes the input editable when the player clicks the edit-icon
        $scope.makeInputEditable = function($event){
            const editorDiv = $event.target.parentNode.parentNode.parentNode // Really bad method of getting parent-element
            editorDiv.children[0].disabled = false;
            editorDiv.children[0].focus()
        }

        // Inform the player that the player was deleted
        $scope.informOnDelete = function(){
            const playerFormElements = document.getElementById('player-form').children
             playerFormElements[1].innerHTML = `Player ${$scope.playerInfo.username} was deleted from the session and the player-database`
             for (let i = 2; i < playerFormElements.length; i++){
                 playerFormElements[i].style.display = "none"
             } 
        }

        // Deletes the player from the player-collection
        $scope.deletePlayer = function(){
            console.log($scope.playerInfo.university)
            $http.delete('/api/players/' + $scope.playerInfo._id) 
                    .then(function successCallback(response){
                        console.log(`Success: ${JSON.stringify(response)} `)
                        $scope.informOnDelete()
                    },
                    function errorCallback(response){
                        console.log(`Could not delete player: ${JSON.stringify(response)}`)
                    })

            // Unregister university
            $http.put('/api/universities/unregister/' + $scope.playerInfo.university)
            .then(function successCallback(response){
                console.log(`Success: ${JSON.stringify(response.data)} `)
            },
                function errorCallback(response){
                    console.log(`Could not delete player: ${JSON.stringify(response)}`)
                })
            
            // Unregister employment
            $http.put('/api/employments/unregister/' + $scope.playerInfo.employment)
            .then(function successCallback(response){
                console.log(`Success: ${JSON.stringify(response.data)} `)
            },
                function errorCallback(response){
                    console.log(`Could not delete player: ${JSON.stringify(response)}`)
                })
            
            // Unregister political
            $http.put('/api/politicals/unregister/' + $scope.playerInfo.political)
            .then(function successCallback(response){
                console.log(`Success: ${JSON.stringify(response.data)} `)
            },                    
                function errorCallback(response){
                    console.log(`Could not delete player: ${JSON.stringify(response)}`)
                })
        }

        // Updates the player info if user registered new changes
        $scope.updatePlayer = function(){

            $http.put('/api/players/' + $scope.playerInfo._id, $scope.playerInfo) 
            .then(function successCallback(response){
                console.log(`Success: ${JSON.stringify(response)} `)
                alert(`Player was updated successfully`)
            },
            function errorCallback(response){
                console.log(`Could not delete player: ${JSON.stringify(response)}`)
            })

            // Check if changes were made to university, political or employment. Unregister or register based on condition
            const previousUni = playerService.getCurrentPlayer().university
            const currentUni = $scope.playerInfo.university
            if (previousUni != currentUni){
                $http.put('/api/universities/unregister/' + previousUni)
                    .then(function successCallback(response){
                    console.log(`Success: ${JSON.stringify(response)} `)
                },
                    function errorCallBack(response){
                        console.log(`Error: ${JSON.stringify(response)} `)
                    })
                $http.put('/api/universities/register/' + currentUni)
                    .then(function successCallback(response){
                        console.log(`Success: ${JSON.stringify(response)} `)
                    },
                    function errorCallback(response){
                        console.log(`Error: ${JSON.stringify(response)} `)
                    })
            }
            const previousEmployment = playerService.getCurrentPlayer().employment
            const currentEmployment = $scope.playerInfo.employment
            if (previousEmployment != currentEmployment){
                $http.put('/api/employments/unregister/' + previousEmployment)
                    .then(function successCallback(response){
                    console.log(`Success: ${JSON.stringify(response)} `)
                },
                    function errorCallBack(response){
                        console.log(`Error: ${JSON.stringify(response)} `)
                    })
                $http.put('/api/employments/register/' + currentEmployment)
                    .then(function successCallback(response){
                        console.log(`Success: ${JSON.stringify(response)} `)
                    },
                    function errorCallback(response){
                        console.log(`Error: ${JSON.stringify(response)} `)
                    })
            }
            const previousPolitical = playerService.getCurrentPlayer().political
            const currentPolitical = $scope.playerInfo.political

            if (previousPolitical != currentPolitical){
                $http.put('/api/politicals/unregister/' + previousPolitical)
                    .then(function successCallback(response){
                    console.log(`Success: ${JSON.stringify(response)} `)
                },
                    function errorCallBack(response){
                        console.log(`Error: ${JSON.stringify(response)} `)
                    })
                $http.put('/api/politicals/register/' + currentPolitical)
                    .then(function successCallback(response){
                        console.log(`Success: ${JSON.stringify(response)} `)
                    },
                    function errorCallback(response){
                        console.log(`Error: ${JSON.stringify(response)} `)
                    })
            }

        }

        $scope.setSessionData()
        $scope.setSelectOptions()
        $scope.getCurrentPlayer()
    }
)
    .filter('renderHTML', function($sce) { 
        return function(val) {
            return $sce.trustAsHtml(val);
        }
      })
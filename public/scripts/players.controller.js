/**
* Angular controller that manages the Players-view in the Admin-page. Manages adding, deleting and updating. 
* @extends Angular
*/
angular.module('playersController', []) // Läs 1 nedan
    .controller('PlayersController', function PlayersController($scope, $http) {
        // Parameters for creating a new player
        $scope.userName
        $scope.age, 
        $scope.city
        $scope.university
        $scope.employment
        $scope.politicalLeaning

        // Populates the player-table with all registered players
        $scope.getAllPlayers = function(){
            $http.get('/api/players')
                .then(function successCallback(response){
                    $scope.allPlayers = response.data

                    for(let i = 0; i < $scope.allPlayers.length; i++){
                        $scope.allPlayers[i].previousUni = $scope.allPlayers[i].university._id // Sets the university_id that the player had on init
                        $scope.allPlayers[i].previousPol = $scope.allPlayers[i].political._id // Sets the political_id that the player had on init
                        $scope.allPlayers[i].previousEmp = $scope.allPlayers[i].employment._id // Sets the employment_id that the player had on init
                    }
                },
                function errorCallback(response){
                    console.log(`Error getting all players: ${JSON.stringify(response.data)}`)
                })
                
        }

        // Populates the select-elements for creating a new player 
        $scope.setSelectOptions = function(){
            $http.get('/api/politicals') 
                .then(function successCallback(response){
                    $scope.politicalLeanings = response.data
                },
                function errorCallBack(response){
                    console.log(`Error getting politicals: ${JSON.stringify(response.data)}`)
                })
            $http.get('/api/employments') 
                .then(function successCallback(response){
                    $scope.employmentStatuses = response.data
                },
                function errorCallBack(response){
                    console.log(`Error getting employment statuses: ${JSON.stringify(response.data)}`)
                })
            $http.get('/api/universities') 
                .then(function successCallback(response){
                    $scope.universities = response.data
                },
                function errorCallBack(response){
                    console.log(`Error getting universities: ${JSON.stringify(response.data)}`)
                })
        }

        // Deletes a player from the players collection and unregisters the university, political and employment status
        $scope.deletePlayer = function($event, player){

            $event.preventDefault()

            // Deletes the player based on the player_id
            $http.delete('/api/players/' + player._id)
                .then(function successCallback(response){
                    console.log(`Player was deleted: ${JSON.stringify(response.data)}`)
                    $scope.getAllPlayers()
                },
                function errorCallback(response){
                    console.log(`Error deleting player: ${JSON.stringify(response.data)}`)
                })
            
            // Unregister university
            $http.put('/api/universities/unregister/' + player.university._id)
            .then(function successCallback(response){
                console.log(`Success: ${JSON.stringify(response.data)} `)
            },
                function errorCallback(response){
                    console.log(`Could not delete player: ${JSON.stringify(response)}`)
                })
            
            // Unregister employment
            $http.put('/api/employments/unregister/' + player.employment._id)
            .then(function successCallback(response){
                console.log(`Success: ${JSON.stringify(response.data)} `)
            },
                function errorCallback(response){
                    console.log(`Could not delete player: ${JSON.stringify(response)}`)
                })
            
            // Unregister political
            $http.put('/api/politicals/unregister/' + player.political._id)
            .then(function successCallback(response){
                console.log(`Success: ${JSON.stringify(response.data)} `)
            },                    
                function errorCallback(response){
                    console.log(`Could not delete player: ${JSON.stringify(response)}`)
                })
        }

        // Updates the player-info and registers and unregisters if changes were made to university, political or employment. 
        $scope.updatePlayerInfo = function($event, playerId, username, age, city, employment, university, political, previousUni, previousPol, previousEmp){
            // Player info (Post-request)
            $scope.updatePlayer = {
                username: username,
                age: age,
                city: city,
                university: university,
                employment: employment,
                political: political
            }

            // Update the player
            $http.put('/api/players/' + playerId, $scope.updatePlayer)
                .then(function successCallback(response){
                    alert(`Player is now updated: ${JSON.stringify(response.data)}`)
                    $scope.getAllPlayers()
                },
                function errorCallback(response){
                    alert(`Error updating player: ${JSON.stringify(response.data)}`)
                })
            
            // Check if changes were made to employment
            if (previousEmp != employment){ // If changes were made
                $http.put('/api/employments/unregister/' + previousEmp) // Unregister previous employment
                    .then(function successCallback(response){
                    console.log(`Success: ${JSON.stringify(response.data)} `)
                },
                    function errorCallBack(response){
                        console.log(`Error: ${JSON.stringify(response.data)} `)
                    })
                $http.put('/api/employments/register/' + employment) // Register new employment
                    .then(function successCallback(response){
                        console.log(`Success: ${JSON.stringify(response.data)} `)
                    },
                    function errorCallback(response){
                        console.log(`Error: ${JSON.stringify(response.data)} `)
                    })
                }
            
            // Check if changes were made to political
            if (previousPol != political){ // If changes were made
                $http.put('/api/politicals/unregister/' + previousPol) // Unregister previous political
                    .then(function successCallback(response){
                    console.log(`Success: ${JSON.stringify(response.data)} `)
                },
                    function errorCallBack(response){
                        console.log(`Error: ${JSON.stringify(response.data)} `)
                    })
                $http.put('/api/politicals/register/' + political) // Register new political
                    .then(function successCallback(response){
                        console.log(`Success: ${JSON.stringify(response.data)} `)
                    },
                    function errorCallback(response){
                        console.log(`Error: ${JSON.stringify(response.data)} `)
                    })
            }

            // Check if changes were made to university
            if (previousUni != university){
                $http.put('/api/universities/unregister/' + previousUni) // Unregister previous university
                    .then(function successCallback(response){
                    console.log(`Success: ${JSON.stringify(response.data)} `)
                },
                    function errorCallBack(response){
                        console.log(`Error: ${JSON.stringify(response.data)} `)
                    })
                $http.put('/api/universities/register/' + university) // Register new university
                    .then(function successCallback(response){
                        console.log(`Success: ${JSON.stringify(response.data)} `)
                    },
                    function errorCallback(response){
                        console.log(`Error: ${JSON.stringify(response.data)} `)
                    })
            }
        }

        // Adds a new player to the player collection and registers employment, university and political
        $scope.addPlayer = function($event, username, age, city, employment, university, political){
            $event.preventDefault()
            if(employment == null || university == null || political == null){
                alert("You have to select university, employment (pick I dont't study if none) and political leaning to register")
            }
            else{
                $scope.newPlayer = {
                    username: username,
                    age: age,
                    city: city,
                    university: university,
                    employment: employment,
                    political: political
                }
                $http.post('/api/players', $scope.newPlayer)
                    .then(function successCallback(response){
                        alert(`Player was added: ${JSON.stringify(response.data)}`)
                        $scope.getAllPlayers()
                    },
                    function errorCallback(response){
                        alert(`Error adding player: ${JSON.stringify(response.data)}`)
                    })
                    $http.put('/api/universities/register/'+ university)
                    .then(function successCallback(response){
                        console.log(`University was registered ${JSON.stringify(response.data)}`)
    
                    },
                    function errorCallback(response){
                        alert(`Error registering the university: ${JSON.stringify(response.data)}`)
                    })
    
                    $http.put('/api/politicals/register/'+ political)
                    .then(function successCallback(response){
                        console.log(`Political was registered ${JSON.stringify(response.data)}`)
    
                    },
                    function errorCallback(response){
                        alert(`Error registering the political: ${JSON.stringify(response.data)}`)
                    })
                    $http.put('/api/employments/register/'+ employment)
                    .then(function successCallback(response){
                        console.log(`Employment was registered ${JSON.stringify(response.data)}`)
    
                    },
                    function errorCallback(response){
                        alert(`Error registering the employment: ${JSON.stringify(response.data)}`)
                    })
            }
        }

        // Functions triggered on init
        $scope.getAllPlayers()
        $scope.setSelectOptions()
    }
)
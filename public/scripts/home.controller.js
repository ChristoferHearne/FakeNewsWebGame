/**
* Angular controller that manages the Home-page
* @extends Angular
*/
angular.module('homeController', []) // Läs 1 nedan
    .controller('HomeController', function HomeController($scope, $http, $state, playerService) {

        // Paragraphs on the homepage
        $scope.title = 'The Fake News Web Game'
        $scope.subtitle = 'AN ANGULARJS/MONGODB Project by Christofer Hearne'

        // Parameters to create a player
        $scope.userName
        $scope.age, 
        $scope.city
        $scope.university
        $scope.employment
        $scope.politicalLeaning

        // Populate the select-elements in the player registration form
        $scope.setSelectOptions = function(){
                $http.get('/api/universities') 
                    .then(function successCallback(response){
                        $scope.universities = response.data // Data for university-select
                },
                function errorCallback(response){
                    console.log(`Error getting the article for this round: ${JSON.stringify(response)}`)
                })
                $http.get('/api/politicals') 
                    .then(function successCallback(response){
                        $scope.politicalLeanings = response.data // Data for political leanings-select
    
            },
                function errorCallback(response){
                    console.log(`Error getting the article for this round: ${JSON.stringify(response)}`)
                })
                $http.get('/api/employments') 
                    .then(function successCallback(response){
                        $scope.employmentStatuses = response.data // Data for employment statuses-select
    
            },
                function errorCallback(response){
                    console.log(`Error getting the article for this round: ${JSON.stringify(response)}`)
                })
        }
            // Starts the game by adding the player, using the service to set current player data and navigates to the gamesession-view
            $scope.startPlayerSession = function($event, username, age, city, employment, university, politicalLeaning){
                $event.preventDefault() // Prevents form from resubmitting
                if (employment == null  || university == null || politicalLeaning == null){
                    alert("You have to select university, employment (pick I dont't study if none) and political leaning to register")
                }
                else{
                    $scope.newPlayer = {
                        username: username, 
                        age: age,
                        city: city, 
                        employment: employment,
                        university: university, 
                        political: politicalLeaning
                    }
                    // Player-information based on player registration form (Post-request)
                    $http.post('/api/players', $scope.newPlayer) 
                        .then(function successCallback(response){
                            console.log(`Player ${$scope.newPlayer.username} was registered ${JSON.stringify(response.data)}`)
                            playerService.setCurrentPlayer(response.data) // Uses the service to set the current player
                            $state.go('play') // Navigate to the game-session view
    
                    },
                    function errorCallback(response){
                        alert(`Error registering the current player: ${JSON.stringify(response.data)}`)
                    })
    
                    // Registers the university picked by the player
                    $http.put('/api/universities/register/'+ university)
                    .then(function successCallback(response){
                        console.log(`University was registered ${JSON.stringify(response.data)}`)
    
                    },
                    function errorCallback(response){
                        alert(`Error registering the university: ${JSON.stringify(response.data)}`)
                    })
    
                    // Registers the political leaning picked by the player
                    $http.put('/api/politicals/register/'+ politicalLeaning)
                    .then(function successCallback(response){
                        console.log(`Political was registered ${JSON.stringify(response.data)}`)
    
                    },
                    function errorCallback(response){
                        alert(`Error registering the political: ${JSON.stringify(response.data)}`)
                    })
    
                    // Registers the employment status picked by the player
                    $http.put('/api/employments/register/'+ employment)
                    .then(function successCallback(response){
                        console.log(`Employment was registered ${JSON.stringify(response.data)}`)
    
                    },
                    function errorCallback(response){
                        alert(`Error registering the employment: ${JSON.stringify(response.data)}`)
                    })
                }
        }

        // Starts a game session when a user doesn't want to register a player
            // Triggers when "Play without playerinfo" is clicked
        $scope.startSession = function(){
            playerService.setCurrentPlayer(null)
            $state.go('play')
        }

        $scope.setSelectOptions() // Populate select-elements on init
    }
)
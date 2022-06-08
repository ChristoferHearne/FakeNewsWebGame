/**
* Angular controller that manages the data displayed in the Admin-dashboard
* @extends Angular
*/
angular.module('adminController', []) 
    .controller('AdminController', function AdminController($scope, $http) {
        
        // Sets the amount of articles, players, sessions and roundsPlayed at the top of the dashboard
        $scope.getDBTotals = function(){
            $http.get('/api/articles') 
            .then(function successCallback(response){
                $scope.totalArticles = response.data.length // Length of the get-request array is the amount of articles
            },
            function errorCallback(response){
                console.log(`Error getting all articles: ${JSON.stringify(response)}`)
            })


            $http.get('/api/sessions') 
            .then(function successCallback(response){
                $scope.totalSessions = response.data.length // Length of the get-request array is the amount of sessions
            },
            function errorCallback(response){
                console.log(`Error getting all sessions: ${JSON.stringify(response)}`)
            })


            $http.get('/api/statistics') 
            .then(function successCallback(response){
                console.log(response.data)
                $scope.totalRounds = response.data[0].roundsPlayed // Gets amount of rounds played straight from the roundsPlayed-field
            },
            function errorCallback(response){
                console.log(`Error getting all sessions: ${JSON.stringify(response)}`)
            })


            $http.get('/api/players') 
            .then(function successCallback(response){
                $scope.totalPlayers = response.data.length // Length of the get-reques array is the amount of players 
            },
            function errorCallback(response){
                console.log(`Error getting all players: ${JSON.stringify(response)}`)
            })
        }

        // Gets the 10 latest sessions from the endpoint, get-operation sorts based on the latest entries in the collection
        $scope.getLatestSessions = function(){
            $http.get('/api/sessions/latest') 
            .then(function successCallback(response){
                $scope.latestSessions = response.data
                for(let i = 0; i < $scope.latestSessions.length; i++){
                    if ($scope.latestSessions[i].player === null){ // If there was no player registered for the session
                        $scope.latestSessions[i].player = {
                            username: "No player registered"
                        }
                    }
                }
            },
            function errorCallback(response){
                console.log(`Error getting latest sessions: ${JSON.stringify(response)}`)
            })
        }
        
        // Calls both functions on init
        $scope.getDBTotals()
        $scope.getLatestSessions()
    }
)
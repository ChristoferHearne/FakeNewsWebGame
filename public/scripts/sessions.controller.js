/**
* Angular controller that manages the Sessions-view in the Admin-Page
* @extends Angular
*/
angular.module('sessionsController', [])
    .controller('SessionsController', function SessionsController($scope, $http) {

        // Get all sessions
        $scope.getAllSessions = function(){
            $http.get('/api/sessions') 
                .then(function successCallback(response){
                    $scope.allSessions = response.data

                    for(let i = 0; i < $scope.allSessions.length; i++){
                        if ($scope.allSessions[i].player === null){ // If a player was not registered
                            $scope.allSessions[i].player = {username: 'No player Registered'} // Set dummy username
                        }
                    }
            },
                function errorCallback(response){
                    console.log(`Error getting all sessions: ${JSON.stringify(response)}`)
                })
        }

        // Deletes a session from the sessions-collection
        $scope.deleteSession = function($event, sessionId){
            $event.preventDefault()
            $http.delete('/api/sessions/' + sessionId)
                .then(function successCallback(response){
                    console.log(`Session was deleted: ${JSON.stringify(response)}`)
                    $scope.getAllSessions()
                },
                function errorCallback(response){
                    console.log(`Error deleting session: ${JSON.stringify(response)}`)
                })
        }
        $scope.getAllSessions()
    }    
)
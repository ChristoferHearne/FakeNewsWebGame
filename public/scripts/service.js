/**
* Angular service with getters and setters for the currentPlayer and the currentSession
* @extends Angular
*/
angular.module('webGameService', [])
    .factory('playerService', function(){
        var currentPlayer = null
        return {
            setCurrentPlayer: function(player){
                currentPlayer = player
            },
            getCurrentPlayer: function(){
                return currentPlayer
            }
        }
    })
    .factory('sessionService', function(){
        var currentSession = {}
        return {
            setCurrentSession: function(session){
                currentSession = session
            },
            getCurrentSession: function(){
                return currentSession
            }
        }
    })
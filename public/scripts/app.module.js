/**
* Class that declares the main module for the webGame, injects all components, services and the router
* @extends Angular
*/
var app = angular.module('webGame', [
    'webGameRouter',
    'homeController',
    'gameSessionController',
    'resultsController',
    'webGameService',
    'adminController', 
    'statisticsController',
    'articlesController',
    'sessionsController',
    'playersController'
])
/**
* State provider that keeps track of all navigation in the game
* @extends Angular
*/
var app = angular.module('webGameRouter', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home'); // Redirect to home if any navigation does not have a state
    $stateProvider
        // HOME PAGE ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'html/home.html'
        })

        // PLAYSESSION PAGE (PLAYER WITHOUT INFO) =================================
        .state('play', {
            url: '/play',
            templateUrl: 'html/gamesession.html'
        })
        // RESULTS PAGE (AFTER PLAYER FINISHED THE GAME) =================================
        .state('results', {
            templateUrl: 'html/results.html'
        })

        // STATISTICS PAGE =================================
        .state('statistics', {
            url: '/statistics',
            templateUrl: 'html/statistics.html'
        })

        // ADMIN PAGE (LANDING) =================================
        .state('admin', {
            url: '/admin',
            templateUrl: 'html/admin.html'
        })
        // ADMIN PAGE (ARTICLES) =================================
        .state('articles', {
            url: '/admin/articles',
            templateUrl: 'html/articles.html'
        })
        // ADMIN PAGE (SESSIONS) =================================
        .state('sessions', {
            url: '/admin/sessions',
            templateUrl: 'html/sessions.html'
        })
        .state('players', {
            url: '/admin/players',
            templateUrl: 'html/players.html'
        })
});
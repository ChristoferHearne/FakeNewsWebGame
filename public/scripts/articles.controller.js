/**
* Angular controller that manages the data displayed in the Articles-view in the Admin-page
* @extends Angular
*/
angular.module('articlesController', []) // Läs 1 nedan
    .controller('ArticlesController', function ArticlesController($scope, $http) {
        // Gets all articles and assigns to a scoped variable
        $scope.getAllArticles = function(){
            $http.get('/api/articles') 
                .then(function successCallback(response){
                    $scope.allArticles = response.data
            },
                function errorCallback(response){
                    console.log(`Error getting all articles: ${JSON.stringify(response)}`)
                })
        }

        $scope.getAllArticles() // Get articles on init
    }    
)
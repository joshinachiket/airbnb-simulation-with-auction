var traceBid = angular.module('traceBid', ['ui.router']);
traceBid.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('traceBid', {
        url : '/TraceBidGraph',
        views: {
            'header': {
                templateUrl : 'templates/profileHeader.html',
            },
            'content': {
                templateUrl : 'templates/profileContent.html',

            },
        }
    })
    $urlRouterProvider.otherwise('/');
});


traceBid.controller('TraceBidController', function($scope, $http,$state,$window) {

    $scope.Account = function()
    {
        window.location.assign("/Account");
    }

    $scope.EditProfile = function()
    {
        window.location.assign("/EditProfile");
    }

    $scope.ClickPage = function()
    {
        window.location.assign("/ClickPageGraph");
    }

    $scope.ClickProperty = function()
    {
        window.location.assign("/PropertyClickGraph");
    }
    $scope.TraceUser = function()
    {
        window.location.assign("/TraceUserGraph");
    }
    $scope.TraceBid = function()
    {
        window.location.assign("/TraceBidGraph");
    }
    $scope.Profile = function()
    {
        window.location.assign("/Profile");
    }


});
var WannaApp = angular.module('WannaApp', ['ngRoute']);

WannaApp.config(function($routeProvider){
  $routeProvider
    .when('/', {
        controller: 'SearchController',
        templateUrl: 'templates/search.html'
    }).when('/login', {
        controller: 'UserController',
        templateUrl: 'app/views/login.html'
    }).otherwise({
        redirectTo: '/'
    });
});
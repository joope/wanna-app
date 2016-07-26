var WannaApp = angular.module('WannaApp', ['ngRoute']);

WannaApp.config(function($routeProvider){
  $routeProvider
    .when('/', {
        controller: 'SearchController',
        templateUrl: 'templates/search.html'
    }).when('/login', {
        controller: 'LoginController',
        templateUrl: 'templates/login.html'
    }).when('/signup', {
        controller: 'SignupController',
        templateUrl: 'templates/signup.html'
    }).otherwise({
        redirectTo: '/'
    });
});
var WannaApp = angular.module('WannaApp', ['ngRoute']);

WannaApp.config(function($routeProvider){
  $routeProvider
    .when('/', {
        controller: 'SearchController',
        templateUrl: 'templates/search.html',
        resolve: {
        userLoggedIn: function($rootScope, Api){
          return Api.login().success(function(user){
            $rootScope.userLoggedIn = user.username;
            $rootScope.userID = user.userID;
          });
        }
      }
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
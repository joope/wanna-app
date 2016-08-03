var WannaApp = angular.module('WannaApp', ['ngRoute', 'ngAnimate']);

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
    }).when('/view', {
        controller: 'SearchController',
        templateUrl: 'templates/view.html',
        resolve: {
        userLoggedIn: function($rootScope, Api){
          return Api.login().success(function(user){
            $rootScope.userLoggedIn = user.username;
            $rootScope.userID = user.userID;
          });
        }
      }
        
    }).when('/signup', {
        controller: 'SignupController',
        templateUrl: 'templates/signup.html'
    }).when('/events', {
        controller: 'EventsController',
        templateUrl: 'templates/events.html',
        resolve: {
        userLoggedIn: function($rootScope, Api){
          return Api.login().success(function(user){
            $rootScope.userLoggedIn = user.username;
            $rootScope.userID = user.userID;
          });
        }
      }
    }).when('/calendar', {
		controller: 'CalendarController',
		templateUrl: 'templates/calendar.html',         
		resolve: {
        userLoggedIn: function($rootScope, Api){
          return Api.login().success(function(user){
            $rootScope.userLoggedIn = user.username;
            $rootScope.userID = user.userID;
          });
        }
		}
	})
	.otherwise({
        redirectTo: '/'
    });
});
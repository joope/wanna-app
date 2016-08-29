var WannaApp = angular.module('WannaApp', ['ngRoute', 'ngAnimate', '720kb.datepicker']);

WannaApp.directive('focusMe', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(attrs.focusMe, function(value) {
        if(value === true) { 
          //$timeout(function() {
            element[0].focus();
            scope[attrs.focusMe] = false;
          //});
        }
      });
    }
  };
});

WannaApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
        controller: 'SearchController',
        templateUrl: 'templates/search.html',
        title: 'Etusivu',
        resolve: {
            userLoggedIn: function ($rootScope, Api) {
                return Api.login().success(function (user) {
                    $rootScope.userLoggedIn = user.username;
                    $rootScope.userID = user.userID;
                });
            }
        }
        }).when('/event/:id', {
        controller: 'EventsController',
        templateUrl: 'templates/view.html',
        title: "Selaa",
        resolve: {
            userLoggedIn: function ($rootScope, Api) {
                return Api.login().success(function (user) {
                    $rootScope.userLoggedIn = user.username;
                    $rootScope.userID = user.userID;
                });
            }
        }


    }).when('/signup', {
        controller: 'SignupController',
        templateUrl: 'templates/signup.html',
        title: 'Kirjaudu'
    }).when('/events', {
        controller: 'EventsController',
        templateUrl: 'templates/events.html',
        title: "Suositukset",
        resolve: {
            userLoggedIn: function ($rootScope, Api) {
                return Api.login().success(function (user) {
                    $rootScope.userLoggedIn = user.username;
                    $rootScope.userID = user.userID;
                });
            }
        }

    }).when('/calendar', {
        controller: 'CalendarController',
        templateUrl: 'templates/calendar.html',
        title: "Kalenteri",
        resolve: {
            userLoggedIn: function ($rootScope, Api) {
                return Api.login().success(function (user) {
                    $rootScope.userLoggedIn = user.username;
                    $rootScope.userID = user.userID;
                });
            }
        }
    }).when('/group/:id', {
        controller: 'SearchController',
        templateUrl: 'templates/search.html',
        title: "Ryhmän nimi tänne",
        resolve: {
            userLoggedIn: function ($rootScope, Api) {
                return Api.login().success(function (user) {
                    $rootScope.userLoggedIn = user.username;
                    $rootScope.userID = user.userID;
                });
            }
        }
    }).when('/login', {
        controller: 'LoginController',
        templateUrl: 'templates/login.html',
        title: "kirjautuminen"
    })
    .otherwise({
        redirectTo: '/'
    });
});

WannaApp.run(['$rootScope', function ($rootScope) {
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            $rootScope.title = current.$$route.title;
        });
    }]);
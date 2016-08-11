var WannaApp = angular.module('WannaApp', ['ngRoute', 'ngAnimate', '720kb.datepicker']);

WannaApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'SearchController',
            templateUrl: 'templates/search.html',
            resolve: {
                userLoggedIn: function ($rootScope, Api) {
                    return Api.login().success(function (user) {
                        $rootScope.userLoggedIn = user.username;
                        $rootScope.userID = user.userID;
                    });
                }
            },
            title: 'Etusivu'
        }).when('/view', {
        controller: 'SearchController',
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
        
    }).otherwise({
        redirectTo: '/'
    });
});

WannaApp.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);
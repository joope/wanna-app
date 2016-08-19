WannaApp.controller('LoginController', function ($scope, $rootScope, Api, $location) {
    if ($rootScope.userID) {
        $location.path('/');
    }
    
    $scope.newNick = function (nick) {
            console.log("new nick: " + nick);

            Api.register(nick).success(function (res) {
                console.log(res);
                if (!res.error) {
                    $scope.error = "";
                    $rootScope.userID = res.id;
                    $rootScope.userLoggedIn = res.username;
                    $location.path('/');
                } else {
                    $scope.error = res.error;
                }
            }).error(function (data, status) {
                console.log("couldn't save nickname");
            });
        }
    
});

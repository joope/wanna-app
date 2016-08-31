WannaApp.controller('EventsController', function ($scope, $rootScope, Api, $routeParams) {
    $scope.event;
    $scope.notificationsToggled = false;

//    Api.getEvent($routeParams.id).success(function (res) {
//        $scope.event = res;
//        $scope.event.joined = true;
//        $scope.event.userList = $scope.listUsers(res);
//        if (!$scope.checkUsers(res)) {
//            $scope.event.joined = false;
//        }
//        $scope.$applyAsync();
//    });
    update = function () {
        io.socket.get('/event/' + $routeParams.id, function (res) {
            $scope.event = res;
            $scope.event.joined = true;
            $scope.event.userList = $scope.listUsers(res);
            if (!$scope.checkUsers(res)) {
                $scope.event.joined = false;
            }
            $scope.$applyAsync();
        })
    };
    update();


    io.socket.on('event', function (data) {
        if (data.id === $routeParams.id) {
            update();
        }
    })
});


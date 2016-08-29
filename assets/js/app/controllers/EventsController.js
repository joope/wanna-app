WannaApp.controller('EventsController', function ($scope, $rootScope, Api, $routeParams) {
    $scope.event;
    $scope.notificationsToggled = false;
    
    Api.getEvent($routeParams.id).success(function (res) {
        $scope.event = res;
        $scope.event.joined = true;
        $scope.event.userList = $scope.listUsers(res);
        if (!$scope.checkUsers(res)) {
            $scope.event.joined = false;
        }
        $scope.$applyAsync();
    });

    io.socket.on('message', function (data) {
        console.log(data);
        if (data.event === $routeParams.id) {
            $scope.refreshEvent($scope.event);
        }
    })
});


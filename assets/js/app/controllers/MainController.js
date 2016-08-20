WannaApp.controller('MainController', function ($timeout, $scope, $rootScope, Api, $routeParams, $location) {
    $scope.notifications = [];
    var timer;

    io.socket.get('/user/notifications', function (res) {
        console.log(res);
        $scope.notifications = res.notifications;
        $scope.userList = res.events;
        $scope.$applyAsync();
    });

    io.socket.on('event', function (update) {
        console.log('List updated!', update);
        console.log($scope.notifications)
        $scope.newNotification(update.data, 5000);
        $scope.$apply();
    });

    $scope.newNotification = function (message, timeout) {
        var not = {
            message: message,
            createdAt: new Date().toJSON(),
            type: "info"
        };
        $scope.notifications.push(not);
        $scope.notification = message;
        $timeout.cancel(timer);
        if (timeout) {
            timer = $timeout(function () {
                $scope.notification = '';
            }, timeout);
        }
    }

});


WannaApp.controller('MainController', function ($timeout, $scope, $rootScope, Api, $routeParams, $location) {
    $scope.notifications = [];
    $scope.date = new Date();
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

    $scope.dateChanged = function (eventDate, index) {
        var date = new Date(eventDate);
        if (!$scope.prevDate || index === 0) {
            $scope.prevDate = date;
            return true;
        }
        if ($scope.prevDate.getDate() === date.getDate() && $scope.prevDate.getMonth() === date.getMonth()) {
            return false;
        }
        $scope.prevDate = date;
        return true;
    }

    $scope.dateToRelative = function (eventDate) {
        var date = new Date(eventDate);
        if ($scope.date.getMonth() === date.getMonth() && $scope.date.getDate() === date.getDate()) {
            return "Tänään";
        } else if ($scope.date.getDate() + 1 === date.getDate()) {
            //ei huomioi kuukauden vaihtumista
            return "Huomenna";
        } else {
            switch (date.getDay()) {
                case 0:
                    return "Sunnuntai";
                case 1:
                    return "Maanantai";
                case 2:
                    return "Tiistai";
                case 3:
                    return "Keskiviikko";
                case 4:
                    return "Torstai";
                case 5:
                    return "Perjantai";
                case 6:
                    return "Lauantai";
            }
        }
    }
    $scope.listUsers = function (event) {
        var list = [];
        if (!event.users || event.users.length === 0) {
            return "ei osallistujia :(";
        }
        for (u in event.users) {
            list.push(event.users[u].username);
        }
        return list.join(", ");
    };

});


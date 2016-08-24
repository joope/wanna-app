WannaApp.controller('MainController', function ($timeout, $scope, $rootScope, Api, $window) {
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
        console.log('new notification', update);
        $scope.newNotification(update.data, 5000);
        $scope.$apply();
    });

    $scope.join = function (event) {
        if (!event.joined) {
            Api.joinEvent(event.id).success(function (res) {
                console.log(res);
                event.currentSize = event.currentSize + 1;
            });
            event.joined = true;
        } else {
            Api.leaveEvent(event.id).success(function (res) {
                console.log(res);
                event.currentSize = event.currentSize - 1;
            });
            event.joined = false;
        }
    }

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

    $scope.difference = function (date) {
        var d = new Date(date);

        if (d.getTime() < $scope.date.getTime() + (1000 * 60 * 60)) {
            return true;
        }
        return false;
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
    $scope.checkUsers = function (event) {
        for (w in event.users) {
            if (event.users[w].id === $rootScope.userID) {
                return true;
            }
        }
        return false;
    }
    $scope.oldEvent = function (event) {
        var e = new Date(event.date);
        if (e.getTime() < new Date()) {
            return true;
        }
        return false;
    }

    $scope.eventClicked = function (event) {
        if (!event.clicked) {
            Api.getEvent(event.id).success(function (res) {
                event.userList = $scope.listUsers(res);
                if ($scope.checkUsers(res)) {
                    event.joined = true;
                    $scope.$applyAsync();
                }
            })
        }
        event.clicked = !event.clicked;
    }

});


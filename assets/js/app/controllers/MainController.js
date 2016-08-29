WannaApp.controller('MainController', function ($timeout, $scope, $rootScope, Api, $window) {
    $scope.notifications = [];
    $scope.notificationsToggled = false;
    $scope.lastCheck;
    $scope.newNotifs = 0;
    $scope.iconEvents = 0;
    $scope.date = new Date();
    var timer;

    io.socket.get('/user/notifications', function (res) {
        console.log(res);
        $scope.userList = res.events;
        $scope.lastCheck = new Date(res.lastNotificationCheck);
        $scope.notifications = parseNotifications(res.notifications);


        $scope.$applyAsync();
    });

    io.socket.on('event', function (update) {
        console.log(update);
        switch (update.verb) {
            case 'messaged':
                $scope.newNotification(update, 5000, true);
                break;
        }
    });

    io.socket.on('wanna', function (update) {
        console.log(update);
        if ($rootScope.userID !== update.data.triggered) {
            $scope.newNotification(update, 5000, true);
        }
    })

    parseNotifications = function (list) {
        if (!$scope.lastCheck) {
            $scope.newNotifs = list.length;
        } else {
            for (n in list) {
                if ($scope.lastCheck < new Date(list[n].createdAt)) {
                    $scope.newNotifs++;
                    list[n].unread = true;
                }
            }
        }
        return list;
    }

    $scope.newNotification = function (notif, timeout, save) {
        if (save) {
            var not = {
                message: notif.data.content,
                createdAt: new Date().toJSON(),
                type: "info",
                unread: true,
                event: notif.id
            };
            $scope.newNotifs++;
            $scope.notifications.push(not);
            $scope.notification = notif.data.content;
        } else {
            $scope.notification = notif;
        }
        
        $timeout.cancel(timer);
        if (timeout) {
            timer = $timeout(function () {
                $scope.notification = '';
            }, timeout);
        }
        $scope.$applyAsync();
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
        if ($scope.date.getMonth() === date.getMonth() && $scope.date.getDate() === date.getDate() && $scope.date.getYear() === date.getYear()) {
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
        if (e.getTime() + 1000 * 60 * 60 < new Date().getTime()) {
            return true;
        }
        return false;
    }

    $scope.eventClicked = function (event) {
        if (!event.clicked) {
            $scope.refreshEvent(event);
        }
        event.clicked = !event.clicked;
    }

    $scope.refreshEvent = function (event) {
        Api.getEvent(event.id).success(function (res) {
            event.userList = $scope.listUsers(res);
            event.currentSize = res.currentSize;
            if ($scope.checkUsers(res)) {
                event.joined = true;
            }
            $scope.$applyAsync();
        })
    }

    $scope.join = function (event) {
        if (!event.joined) {
            Api.joinEvent(event.id).success(function (res) {
                $scope.iconEvents++;
                $scope.refreshEvent(event);
                io.socket.get('/event/' + event.id);
                $scope.newNotification("Liityttiin tapahtumaan " + event.name + "!", 5000, false);
            });
            event.joined = true;
        } else {
            Api.leaveEvent(event.id).success(function (res) {
                $scope.refreshEvent(event);
                io.socket.get('/user/unsubscribe/' + event.id);
                $scope.newNotification("Lähdettiin tapahtumasta " + event.name + ".", 5000, false);
            });
            event.joined = false;
        }
    }

    $scope.checkNotifications = function () {
        $scope.notificationsToggled = !$scope.notificationsToggled;
        if ($scope.notificationsToggled) {
            Api.checkNotifications();
            $scope.lastCheck = new Date();
            $scope.newNotifs = 0;
        }
    }

    $scope.checkCalendar = function () {
        $scope.iconEvents = 0;
    }

    $scope.incrementEventIcon = function () {
        $scope.iconEvents++;
    }

});


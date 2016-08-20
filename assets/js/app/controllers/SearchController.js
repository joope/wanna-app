WannaApp.controller('SearchController', function ($timeout, $scope, $rootScope, Api, $routeParams, $location) {

    if (!$rootScope.userID) {
        $location.path('/login');
    }

    $scope.wannaList = [];
    $scope.eventList = [];
    $scope.userList = [];
    $scope.notifications = [];

    $scope.date = new Date();
    $scope.prevDate;
    $scope.private = false;
    $scope.datepicked;

    var timer;

    Api.getNewEvents(new Date()).success(function (res) {
        $scope.eventList = res;
    }).error(function () {
        $scope.error = "error when retrieving data";
    })

    Api.getWannas().success(function (res) {
        $scope.wannaList = res;
    });
//
//    io.socket.on('event', function (update) {
//        console.log('List updated!', update);
//        console.log($scope.notifications)
//        $scope.newNotification(update.data, 5000);
//        $scope.$apply();
//    });
//
//    io.socket.on('wanna', function (update) {
//        console.log(update);
//    });

    $scope.getPreviousDate = function () {
        var d = new Date();
        d.setDate(d.getDate() - 1);
        return d.toString();
    }

    $scope.searched = function (query) {
        $scope.prevDate = null;
    }

    $scope.checkUsers = function (event) {
        for (w in event.users) {
            if (event.users[w].id === $rootScope.userID) {
                return true;
            }
        }
        return false;
    }

    $scope.toggleForm = function (event) {
        $timeout(function () {
            $scope.formToggled = true;
        }, 1000);

        $scope.what = $scope.search;
        $scope.place = "Esimerkinkatu 333";
        $scope.minSize = 2;
//        $scope.maxSize = 4;

        $scope.time = new Date();
        $scope.time.setHours($scope.time.getHours() + 1);
        $scope.time.setMinutes(0);
        $scope.time.setSeconds(0);
        $scope.time.setMilliseconds(0);
    }

    $scope.selectWanna = function (wanna) {
        $scope.what = wanna.name;
    }

    $scope.listUsers = function (event) {
        var list = [];
        if (!event.users || event.users.length === 0) {
            return "ei osallistujia :(";
        }
        for (u in event.users) {
            list.push(event.users[u].username);
        }
        return list.join();
    };

    $scope.debug = function () {
        console.log($scope.wannaList);
        console.log($scope.eventList);
        console.log($scope.userID);
    }

    $scope.newEvent = function () {
        //poor man's hack for getting date from weird date-string-object
        var dates = $scope.datepicked.split(" ");
        dates = dates[1];
        dates = dates.split('.');
        var newDate = new Date(dates[2], (dates[1] - 1), dates[0]);
        console.log(newDate);
        if (newDate) {
            newDate.setHours($scope.time.getHours());
            newDate.setMinutes($scope.time.getMinutes());

            var event = {
                "wanna": $scope.what.toLowerCase(),
                "name": $scope.what.toLowerCase(),
                "date": newDate,
                "place": $scope.place,
                "ready": false,
//                "maxSize": $scope.maxSize,
                "minSize": $scope.minSize,
                "info": $scope.info
            };
            console.log(event);
            Api.newEvent(event).success(function (res) {
                io.socket.get('/event/' + res.id);
                $scope.search = "";
                $scope.formToggled = false;
                $scope.newNotification("Luotiin tapahtuma: " + $scope.what, 5000);
                Api.getNewEvents(new Date()).success(function (res) {
                    $scope.eventList = res;
                })
            })
        }

    }

    $scope.eventClicked = function (event) {
        if (!event.clicked) {
            Api.getEvent(event.id).success(function (res) {
                event.userList = $scope.listUsers(res);
                event.currentSize = res.currentSize;
                if ($scope.checkUsers(res)) {
                    event.joined = true;
                    $scope.$applyAsync();
                }
            })
        }
        event.clicked = !event.clicked;
    }

    $scope.join = function (event) {
        if (!event.joined) {
            Api.addUserToEvent(event.id).success(function (res) {
                event.currentSize = event.currentSize + 1;
                io.socket.get('/event/' + event.id);
                $scope.newNotification("Liityttiin tapahtumaan " + event.name + "!", 5000);
            });
            event.joined = true;
        } else {
            Api.removeUserFromEvent(event.id).success(function (res) {
                event.currentSize = event.currentSize - 1;
                io.socket.get('/event/' + event.id);
                $scope.newNotification("Lähdettiin tapahtumasta " + event.name + ".", 5000);
            });
            event.joined = false;
        }
    }

    $scope.dateChanged = function (eventDate) {
        var date = new Date(eventDate);
        if (!$scope.prevDate) {
            $scope.prevDate = date;
            return true;
        }
        if ($scope.prevDate.getDate() !== date.getDate() && $scope.prevDate.getMonth() === date.getMonth()) {
            $scope.prevDate = date;
            return true;
        }
        if ($scope.prevDate.getDate() !== date.getDate() && $scope.prevDate.getMonth() !== date.getMonth()) {
            $scope.prevDate = date;
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
});
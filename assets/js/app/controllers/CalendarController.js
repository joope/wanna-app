WannaApp.controller('CalendarController', function ($scope, $rootScope, Api) {
    $scope.wannaList = [];
    $scope.idToIndex = {};
    $scope.events;
    $scope.date = new Date();
    $scope.prevDate;
    $scope.c = 0;

    $scope.debug = function () {
        console.log($scope.wannaList);
        console.log($scope.events);
        console.log($scope.idToIndex);
    }

    Api.getUserEvents($rootScope.userID).success(function (res) {
        $scope.prevDate = null;
        $scope.events = res;
//        updateAllEvents();
    });

    updateAllEvents = function () {
        for (i = 0; i < $scope.events.length; i++) {
            $scope.idToIndex[$scope.events[i].id] = i;
        }
    }

    io.socket.get('/event', function (body, response) {

    });

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

    $scope.checkUsers = function (event) {
        for (w in event.users) {
            if (event.users[w].id === $rootScope.userID) {
                return true;
            }
        }
        return false;
    }

    $scope.oldEvent = function (event) {
        var current = new Date(event.date);
        current = current.setHours(current.getHours() + 1);
        if (current < new Date()) {
            return true;
        }
        return false;
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

    $scope.join = function (event) {
        if (!event.joined) {
            Api.addUserToEvent(event.id).success(function (res) {
                event.currentSize = event.currentSize + 1;
            });
            event.joined = true;
        } else {
            Api.removeUserFromEvent(event.id).success(function (res) {
                event.currentSize = event.currentSize - 1;
            });
            event.joined = false;
        }
    }
});


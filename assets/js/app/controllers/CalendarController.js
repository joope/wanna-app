WannaApp.controller('CalendarController', function ($scope, $rootScope, Api) {
    $scope.wannaList = [];
    $scope.idToIndex = {};
    $scope.events;
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
        $scope.$applyAsync();
//        updateAllEvents();
    });

    updateAllEvents = function () {
        for (i = 0; i < $scope.events.length; i++) {
            $scope.idToIndex[$scope.events[i].id] = i;
        }
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
    
});


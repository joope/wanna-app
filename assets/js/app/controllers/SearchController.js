WannaApp.controller('SearchController', function ($timeout, $scope, $rootScope, Api, $location) {

    if (!$rootScope.userID) {
        $location.path('/login');
    }

    $scope.formWannas = [];
    $scope.formPlaces = [];
    $scope.eventList = [];
    $scope.eventsCreated = 0;
    idToIndex = {};

    $scope.prevDate;
    $scope.private = false;
    $scope.datepicked;

    var lastMessage = $scope.date.getTime();

    Api.getWannas().success(function (res) {
        $scope.formWannas = res;
    });

    Api.getPlaces().success(function (res) {
        $scope.formPlaces = res;
    });

    io.socket.on('message', function (data) {
        switch (data.verb) {
            case 'created':
                console.log('!');
                $scope.eventsCreated = $scope.eventsCreated + 1;
//                console.log("fetched new events");
//                $scope.refreshEvents();
                break;
            case 'joined':
                $scope.eventList[idToIndex[data.event]].currentSize = $scope.eventList[idToIndex[data.event]].currentSize + 1;
                break;
            case 'left':
                $scope.eventList[idToIndex[data.event]].currentSize = $scope.eventList[idToIndex[data.event]].currentSize - 1;
                break;
        }
        $scope.$applyAsync();
    });

    $scope.getPreviousDate = function () {
        var d = new Date();
        d.setDate(d.getDate() - 1);
        return d.toString();
    }

    $scope.refreshEvents = function () {
        Api.getNewEvents(new Date()).success(function (res) {
            $scope.newEvents = 0;
            $scope.eventsCreated = 0;
            $scope.eventList = res;
            //map event id to list index
            for (i = 0; i < res.length; i++) {
                idToIndex[res[i].id] = i;
            }
            console.log('got new events');
        }).error(function () {
            $scope.error = "error when retrieving data";
        });
    }

    $scope.refreshEvents();

    $scope.searched = function (query) {
        $scope.prevDate = null;
    }

    $scope.toggleForm = function (event) {
        $timeout(function () {
            $scope.formToggled = true;
        }, 1000);

        $scope.what = $scope.search;
        $scope.place = '';
        $scope.minSize = 2;
        $scope.maxSize = 8;

        $scope.time = new Date();
        $scope.time.setHours($scope.time.getHours() + 1);
        $scope.time.setMinutes(0);
        $scope.time.setSeconds(0);
        $scope.time.setMilliseconds(0);
    }

    $scope.selectWanna = function (wanna) {
        $scope.what = wanna.name;
        $timeout(function () {
            $scope.wannaSelected = true;
        }, 100);

    }
    $scope.selectPlace = function (place) {
        $scope.place = place.name;
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
                "private": $scope.private,
                "ready": false,
                "maxSize": $scope.maxSize,
                "minSize": $scope.minSize,
                "info": $scope.info
            };
            console.log(event);
            Api.newEvent(event).success(function (res) {
                io.socket.get('/event/' + res.id);
                $scope.search = "";
                $scope.formToggled = false;
                $scope.incrementEventIcon();
                $scope.newNotification("Luotiin tapahtuma: " + $scope.what, 5000, false);
                $scope.refreshEvents();
            })
        }

    }

    $scope.incrementMin = function (plus) {
        if (plus) {
            $scope.minSize++;
        } else {
            $scope.minSize--;
        }
        if ($scope.maxSize < $scope.minSize) {
            $scope.maxSize = $scope.minSize;
        }
    }
    $scope.incrementMax = function (plus) {
        if (plus) {
            $scope.maxSize++;
        } else {
            $scope.maxSize--;
        }
        if ($scope.maxSize < $scope.minSize) {
            $scope.maxSize = $scope.minSize;
        }
    }
});
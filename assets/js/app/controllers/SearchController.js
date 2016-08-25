WannaApp.controller('SearchController', function ($timeout, $scope, $rootScope, Api, $location) {

    if (!$rootScope.userID) {
        $location.path('/login');
    }

    $scope.wannaList = [];
    $scope.placeList = [];
    $scope.eventList = [];
    $scope.userList = [];

    $scope.prevDate;
    $scope.private = false;
    $scope.datepicked;

    Api.getNewEvents(new Date()).success(function (res) {
        $scope.eventList = res;
    }).error(function () {
        $scope.error = "error when retrieving data";
    });

    Api.getWannas().success(function (res) {
        $scope.wannaList = res;
    });

    Api.getPlaces().success(function (res) {
        $scope.placeList = res;
    });

    $scope.getPreviousDate = function () {
        var d = new Date();
        d.setDate(d.getDate() - 1);
        return d.toString();
    }

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
//        $scope.maxSize = 4;

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
                $scope.addNewEvent();
                $scope.newNotification("Luotiin tapahtuma: " + $scope.what, 5000, false);
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
});
WannaApp.controller('EventsController', function ($scope, $rootScope, Api) {
    $scope.wannaList;
    $scope.events;
    $scope.user;
    $scope.date = new Date();

    $scope.debug = function () {
        console.log($scope.wannaList);
        console.log($scope.events);
        console.log($scope.user);
    }

    Api.getUserWannas($rootScope.userID).success(function (res) {
        $scope.wannaList = res;
    });
    
//    io.socket.get('/user/' + $rootScope.userID, function(body, response) {
//        $scope.wannaList = body.wannas;
//        $scope.user = body;
//        $scope.$apply();
//    });

    io.socket.get('/event', function (body, response) {
        $scope.events = body;
        $scope.$apply();
    });

    io.socket.on('event', function listUpdate(update) {
        console.log('Events updated: ', update);
        Api.getEvents().success(function(res){
            $scope.events = res;
        })
//        Api.getWannaEvents($rootScope.userID).success(function (res) {
//            $scope.events = res;
//        });
    });

    $scope.newEvent = function (wannaID, place, date, min, max) {
        console.log("luodaan event " + place, date, min, max);
        Api.addEventToWanna({
            "wanna": wannaID,
            "date": date,
            "place": place,
            "ready": false,
            "maxSize": min,
            "minSize": max
        }, wannaID);
    }

    $scope.getEventUsers = function (event) {
        var list = [];
        for (u in event.users) {
            list.push(event.users[u].username);
        }
        return list.join();
    }
    
    $scope.getWannaEvents = function(wanna){
        Api.getWannaEvents(wanna).success(function(res){
            return res;  
        })
    }

    $scope.eventClicked = function(event){
        Api.addUserToEvent($rootScope.userID, event.id);
    }
});


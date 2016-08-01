WannaApp.controller('EventsController', function ($scope, $rootScope, Api) {
    $scope.wannaList;
	$scope.idToIndex = {};
    $scope.events;
    $scope.date = new Date();

    $scope.debug = function () {
        console.log($scope.wannaList);
        console.log($scope.events);
		console.log($scope.idToIndex);
    }

    Api.getUserWannas($rootScope.userID).success(function (res) {
        $scope.wannaList = res;
		
		for(i = 0; i < res.length; i++){
			eventsToWannas(res[i].id, i);
			$scope.idToIndex[res[i].id] = i;
		}
    });

    io.socket.get('/wanna', function (body, response) {
        // $scope.events = body;
    });

    io.socket.on('wanna', function listUpdate(update) {
        console.log('Events updated: ', update);
		eventsToWannas(update.id, $scope.idToIndex[update.id]);
    });
	
	eventsToWannas = function(wannaID, index){
		// console.log(wanna, index);
		if($scope.wannaList){
			io.socket.get('/event?where={"wanna": ' + wannaID + '}', function(events){
				if(events && events.length > 0){
					$scope.wannaList[index].events = events;
				} else {
					$scope.wannaList[index].events = null;
				}
				$scope.wannaList[index].searched = true;
				$scope.$apply();
			});
		}
	}
	
	$scope.wannaClicked = function(wanna){
		wanna.isToggled = !wanna.isToggled;
		if (wanna.isToggled){
			io.socket.get('/event?where={"wanna": ' + wanna.id + '}', function(events){
				wanna.events = events;
				$scope.$apply();
			});
		}
	}
	
    $scope.newEvent = function (wannaID, place, date, min, max) {
		$scope.wannaList[$scope.idToIndex[wannaID]].toggleForm = false;
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


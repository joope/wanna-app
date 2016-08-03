WannaApp.controller('EventsController', function ($scope, $rootScope, Api) {
    $scope.wannaList = [];
	$scope.idToIndex = {};
	var date = new Date();
	$scope.date = date;
	
	
	$scope.places = ['Tapiolan keskus', 'Kontulan Ostari', 'Faijan takapiha'];
    $scope.events;

    $scope.debug = function () {
        console.log($scope.wannaList);
        console.log($scope.events);
		console.log($scope.idToIndex);
    }

    Api.getUserWannas($rootScope.userID).success(function (res) {
        $scope.wannaList = res;
		updateAllEvents();
    });
	
	updateAllEvents = function(){
		for(i = 0; i < $scope.wannaList.length; i++){
			eventsToWannas($scope.wannaList[i].id, i);
			$scope.idToIndex[$scope.wannaList[i].id] = i;
		}
	}

    io.socket.get('/wanna', function (body, response) {
        // $scope.events = body;
    });

    io.socket.on('wanna', function listUpdate(update) {
        console.log('Events updated: ', update);
		if($scope.idToIndex[update.id]){
			eventsToWannas(update.id, $scope.idToIndex[update.id]);
		}
    });
	
	io.socket.get('/event', function(body, response){
		
	});
	
	io.socket.on('event', function (body, response) {
		console.log(body);
		updateAllEvents();
	});
	
	eventsToWannas = function(wannaID, index){
		// console.log(wanna, index);

		if($scope.wannaList[index]){
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
	
	$scope.toggleForm = function(wanna){
		$scope.header = wanna.name;
		$scope.place = "Helsinki";
		$scope.wannaID = wanna.id;
		$scope.minSize = 2;
		$scope.maxSize = 4;
		$scope.time = new Date();

		$scope.time.setSeconds(0);
		$scope.time.setMilliseconds(0);
		
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
	
    $scope.newEvent = function () {
        console.log("luodaan event");
		var datetime = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate(), 
               $scope.time.getHours(), $scope.time.getMinutes(), $scope.time.getSeconds());
		if ($scope.oldEvent({date: datetime})){
			$scope.error = "älä haikaile liikaa menneisyyteen";
		} else if($scope.minSize < $scope.maxSize){
		    $scope.error = "minimimäärä ei voi olla suurempi kuin maksimimäärä osallistujissa";
		}// else if(!$scope.minSize || !$scope.maxSize || !$scope.place){
			// $scope.error = "jotain oleellista puuttuu";
		// }
	
	else {
		Api.addEventToWanna({
			"wanna": $scope.wannaID,
			"date": datetime,
			"place": $scope.place,
			"ready": false,
			"maxSize": $scope.minSize,
			"minSize": $scope.maxSize,
			"users": [$rootScope.userID]
		}, $scope.wannaID).success(function(res){
			console.log(res);
		});
		}
		
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
		console.log(event);
		if(!event.clicked){
			Api.addUserToEvent($rootScope.userID, event.id);
			event.clicked = true;
		} else {
			Api.removeUserFromEvent($rootScope.userID, event.id);
			event.clicked = false;
		}
    }
	
	$scope.checkUsers = function(event){
        for(w in event.users){
            if(event.users[w].id === $rootScope.userID){
                event.clicked = true;
                return true;
            }
        }
        return false;
    }
	
$scope.oldEvent = function(event){
	var current = new Date(event.date);
	current = current.setHours(current.getHours() + 1);
	if(current < new Date()){
		return true;
	}
	return false;
}
});


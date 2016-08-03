WannaApp.controller('CalendarController', function ($scope, $rootScope, Api) {
    $scope.wannaList = [];
	$scope.idToIndex = {};
    $scope.events;
    $scope.date = new Date();

    $scope.debug = function () {
        console.log($scope.wannaList);
        console.log($scope.events);
		console.log($scope.idToIndex);
    }

    Api.getUserEvents($rootScope.userID).success(function (res) {
        $scope.events = res;
		updateAllEvents();
    });
	
	updateAllEvents = function(){
		for(i = 0; i < $scope.events.length; i++){
			eventsToList($scope.events[i].id, i);
			$scope.idToIndex[$scope.events[i].id] = i;
		}
	}
	
	io.socket.get('/event', function(body, response){
		
	});
	
	io.socket.on('event', function (update) {
		if($scope.idToIndex[update.id] != null){
			eventsToList(update.id, $scope.idToIndex[update.id]);
		}
	});
	
	eventsToList = function(eventID, index){
		if($scope.events[index]){
			io.socket.get('/event/' + eventID, function(event){
				if(event){
					$scope.events[index] = event;
				} else {
					
				}
				$scope.events[index].searched = true;
				$scope.$apply();
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
		$scope.events.splice($scope.idToIndex[event.id], 1);
		Api.removeUserFromEvent($rootScope.userID, event.id);
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


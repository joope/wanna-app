WannaApp.controller('SearchController', function($scope, $rootScope, Api){
    
    $scope.wannaList = [];
    $scope.userList = [];
    
    io.socket.get('/wanna', function(body, response) {
        $scope.wannaList = body;
        $scope.$apply();
    });
    
    $scope.checkUsers = function(wanna){
        for(w in wanna.users){
            if(wanna.users[w].id === $rootScope.userID){
                wanna.clicked = true;
                return true;
            }
        }
        return false;
    }
    
    if($rootScope.userID){
        Api.getUserWannas($rootScope.userID).success(function(res){
        if(res.constructor === Array){
            $scope.userList = res;
            //find already clicked wannas
            //$scope.$apply();
        } else{
            console.log("no earlier wannas found");
        }
    }).error(function(){
        console.log("error retrieving user wannas, new user?");
    })
}
    
    io.socket.on('wanna', function listUpdate (update) {
        console.log('List updated!', update);
//        switch(update.verb){
//            case "created":
//                if(update.data.users.find(x => x.id === $rootScope.user)){
//                    update.data.clicked = true;
//                    console.log("new wanna was created by user");
//                }
//                $scope.wannaList.push(update.data);
//                break;
//            case "updated":
//                $scope.wannaList.find(x => x.name === update.previous.name).popularity = update.data.popularity; //update.data.popularity;
//                console.log("updated a record");
//                break;
//            default:
//                console.log("list was:" + update.verb);
//        }
        Api.getWannas().success(function(data){
            $scope.wannaList = data;
            //$scope.$apply();
        })
    });
    
    $scope.getWannaUsers = function(wanna){
        var list = [];
        for(u in wanna.users){
            list.push(wanna.users[u].username);
        }
        return list.join();
    };
    
    $scope.debug = function(){
        console.log($scope.wannaList);
        console.log($scope.userList);
        console.log($scope.userID);
    }
    
    $scope.addNew = function(){
        
        var uus = {
            name: $scope.what.toLowerCase(),
            popularity: 1,
            users: [$rootScope.userID]
        }
        $scope.what = "";
        Api.addWanna(uus).success(function(res){
			$scope.userList.push(res);
        }).error(function(res){
            $scope.error = "Ei voitu lisätä wannaa :(";
        });
    }
    
    $scope.newNick = function(nick){
        console.log("new nick: " + nick);
        
        Api.register(nick).success(function(res){
            console.log(res);
            if(!res.error){
                $scope.error = "";
                $rootScope.userID = res.id;
                $rootScope.userLoggedIn = res.username;
            } else{
                $scope.error = res.error;
            }
        }).error(function(data, status){
            console.log("couldn't save nickname");
        });
    }
    
    $scope.removeWanna = function(wanna){
        $scope.userList.splice($scope.userList.indexOf(wanna), 1);
        Api.updateWanna(wanna, {popularity: (wanna.popularity - 1)}).success(function(res){
            console.log(res);
            Api.removeUserFromWanna($rootScope.userID, wanna.id).success(function(res){
                console.log("removed user from wanna" + res);
                }).error(function () {
                    console.log("couldn't remove user from wanna");
                });
            }).error(function(err){
                console.log(err);
            });
    }
        
    
    $scope.wannaClicked = function(wanna){
        console.log("Klikattiin wannaa: " + wanna.name);
		
        if(!wanna.clicked){
            wanna.popularity += 1;
            wanna.clicked = true;
			$scope.userList.push(wanna);
			
            Api.updateWanna(wanna, {popularity: wanna.popularity}).success(function(res){
                Api.addUserToWanna($rootScope.userID, wanna.id).success(function(res){
                    console.log("added user to wanna");
                }).error(function(){
                    console.log("couldn't add user to wanna");
                });
            });

        } else{			
            wanna.popularity -= 1;
            wanna.clicked = false;
			$scope.userList.splice($scope.userList.indexOf(wanna), 1);
			
            Api.updateWanna(wanna, {popularity: wanna.popularity}).success(function(res){
                console.log(res);
                Api.removeUserFromWanna($rootScope.userID, wanna.id).success(function(res){
                    console.log("removed user from wanna" + res);
                    }).error(function () {
                        console.log("couldn't remove user from wanna");
                    });
            }).error(function(err){
                console.log(err);
            });
            
        }
        //$scope.$apply();
    }
    
    
})
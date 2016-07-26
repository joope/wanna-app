WannaApp.controller('SearchController', function($scope, Api){
    
    $scope.userID;
    $scope.wannaList;
    $scope.userList = [];
    //var id = localStorage.getItem('userID');
    
    if(localStorage.getItem('userID')){
        $scope.userID = localStorage.getItem('userID');
        $scope.nickValid = true;
    }
    
    io.socket.get('/wanna', function(body, response) {
        $scope.wannaList = body;
        checkListsForClicked();
        $scope.$apply();
    });
    
    checkListsForClicked = function(){
        for(w in $scope.userList){
            for(a in $scope.wannaList){
                console.log(w,a);
                if($scope.wannaList[a].id === $scope.userList[w].id){
                    $scope.wannaList[a].clicked = true;
                }
            }
        }
    }
    
    Api.getUserWannas(localStorage.getItem('userID')).success(function(res){
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
    
    io.socket.on('wanna', function listUpdate (update) {
        console.log('List updated!', update);
        switch(update.verb){
            case "created":
                $scope.wannaList.push(update.data);
                break;
            case "updated":
                $scope.wannaList.find(x => x.name === update.previous.name).popularity = update.data.popularity; //update.data.popularity;
                console.log("updated a record");
                break;
            default:
                console.log("list was:" + update.verb);
        }
        $scope.$apply();
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
            name: $scope.what,
            popularity: 1,
            users: [localStorage.getItem('userID')]
        }
        Api.addWanna(uus).success(function(res){
            $scope.userList.push(uus);
            $scope.what = "";
        }).error(function(res){
            $scope.error = "Ei voitu lisätä käyttäjää :(";
        });
    }
    
    $scope.newNick = function(nick){
        console.log("new nick: " + nick);
        
        Api.addUser({username: nick}).success(function(res){
            console.log(res);
            localStorage.setItem('userID', res.id);
            $scope.nickValid = true;
        }).error(function(data, status){
            console.log("couldn't save nickname");
        });
    }
        
    
    $scope.wannaClicked = function(wanna){
        console.log("Klikattiin wannaa: " + wanna.name);
        
        if(!wanna.clicked){
            wanna.popularity += 1;
            $scope.userList.push(wanna);
            wanna.clicked = true;
            
            io.socket.put('/wanna/' + wanna.id, {
                popularity: wanna.popularity
            },function(res, jwres){
                console.log(res);
            });
            
            //calculate popularity server side using new user count!
            
            Api.addUserToWanna(localStorage.getItem('userID'), wanna.id).success(function(){
                console.log("added user to wanna");
            }).error(function(){
                console.log("couldn't add user to wanna");
            });
        } else{
            wanna.popularity -= 1;
            $scope.userList.splice($scope.userList.indexOf(wanna), 1);
            wanna.clicked = false;
            
            io.socket.put('/wanna/' + wanna.id, {
                popularity: wanna.popularity
            },function(res, jwres){
                console.log(res);
            });
            
            Api.removeUserFromWanna(localStorage.getItem('userID'), wanna.id).success(function(){
                console.log("removed user from wanna");
            }).error(function(){
                console.log("couldn't remove user from wanna");
            });
            
        }
        //$scope.$apply();
    }
    
    
})
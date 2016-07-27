WannaApp.controller('ViewController', function($scope, $rootScope, Api){
    $scope.wannaList = [];
    
    io.socket.get('/wanna', function(body, response) {
        $scope.wannaList = body;
        $scope.$apply();
    });
    
    io.socket.on('wanna', function listUpdate (update) {
        console.log('List updated!', update);
        Api.getWannas().success(function(data){
            $scope.wannaList = data;
        })
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
});


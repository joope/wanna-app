WannaApp.controller('SearchController', function($scope, $http){
    
    $scope.wannaList;
    
    $scope.userList = [];
    
    $http.get('/wanna').then(function onSuccess(response){
        $scope.wannaList = response.data;
        console.log(response);
    });
    
    $scope.debug = function(){
        console.log($scope.wannaList);
        console.log($scope.userList);
    }
    
    $scope.addNew = function(wanna){
        $http.post('/wanna', {
            name: $scope.what,
            popularity: 1,
            users: $scope.user
        });
        $scope.userList.push(wanna);
    }
        
    
    $scope.wannaClicked = function(wanna){
        console.log("Klikattiin wannaa: " + wanna.name);
        
        if(!wanna.clicked){
            wanna.popularity += 1;
            $scope.userList.push(wanna);
            wanna.clicked = true;
        } else{
            wanna.popularity -= 1;
            $scope.userList.splice($scope.userList.indexOf(wanna), 1);
            wanna.clicked = false;
        }

        //add users also locally here
        
        $http.put('/wanna/' + wanna.id, {
            popularity: wanna.popularity + 1
        })
        
        // pyydä servua lisäämään käyttäjä, odota vastauksena listaa uusista tekemisistä
    }
    
    
})
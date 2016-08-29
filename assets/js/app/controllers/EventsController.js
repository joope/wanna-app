WannaApp.controller('EventsController', function ($scope, $rootScope, Api, $routeParams) {
    $scope.event;
    Api.getEvent($routeParams.id).success(function(res){
        $scope.event = res;
        $scope.refreshEvent($scope.event);
    }).error(function(){
        $scope.error = "Ei löydetty kyseistä tapahtumaa??!";
    });
    
    io.socket.on('message', function(data){
        console.log(data);
        if(data.event === $routeParams.id){
            $scope.refreshEvent($scope.event);
        }
    })
});


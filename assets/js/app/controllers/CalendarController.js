WannaApp.controller('CalendarController', function ($scope, $rootScope, Api) {
    $scope.wannaList = [];
    $scope.idToIndex = {};
    $scope.events;
    $scope.prevDate;
    $scope.c = 0;

    $scope.debug = function () {
        console.log($scope.wannaList);
        console.log($scope.events);
        console.log($scope.idToIndex);
    }

    Api.getUserEvents().success(function (res) {
        $scope.prevDate = null;
        $scope.events = res;
        $scope.$applyAsync();
//        updateAllEvents();
    });

    updateAllEvents = function () {
        for (i = 0; i < $scope.events.length; i++) {
            $scope.idToIndex[$scope.events[i].id] = i;
        }
    }
});


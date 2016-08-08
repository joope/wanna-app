WannaApp.controller('SearchController', function ($scope, $rootScope, Api) {

    $scope.wannaList = [];
    $scope.eventList = [];
    $scope.userList = [];

    $scope.date = new Date();
    $scope.prevDate;

    Api.getNewEvents(new Date()).success(function (res) {
        $scope.eventList = res;
    }).error(function () {
        $scope.error = "error when retrieving data";
    })

    Api.getWannas().success(function (res) {
        $scope.wannaList = res;
    })

    $scope.checkUsers = function (event) {
        for (w in event.users) {
            if (event.users[w].id === $rootScope.userID) {
                return true;
            }
        }
        return false;
    }

    $scope.toggleForm = function (event) {
        $scope.what = $scope.search;
        $scope.place = "Esimerkinkatu 333";
//        $scope.wannaID = wanna.id;
        $scope.minSize = 2;
        $scope.maxSize = 4;
        $scope.time = new Date();

        $scope.time.setSeconds(0);
        $scope.time.setMilliseconds(0);
    }

    $scope.selectWanna = function (wanna) {
        $scope.wannaID = wanna.id;
        $scope.what = wanna.name;
    }

    io.socket.on('wanna', function listUpdate(update) {
        console.log('List updated!', update);
        Api.getWannas().success(function (data) {
            $scope.wannaList = data;
            //$scope.$apply();
        })
    });

    $scope.getWannaUsers = function (wanna) {
        var list = [];
        for (u in wanna.users) {
            list.push(wanna.users[u].username);
        }
        return list.join();
    };

    $scope.debug = function () {
        console.log($scope.wannaList);
        console.log($scope.eventList);
        console.log($scope.userID);
    }

    $scope.newEvent = function () {
        var event = {
            "name": $scope.what,
            "date": $scope.date,
            "place": $scope.place,
            "ready": false,
            "maxSize": $scope.maxSize,
            "minSize": $scope.minSize,
            "info": $scope.info,
            "users": [$rootScope.userID]
        };
        console.log(event);
        if (!$scope.wannaID) {
            Api.addWanna({name: $scope.what}).success(function (res) {
                event.wanna = res.id;
                Api.addEventToWanna(event, res.id).success(function () {
                    Api.getNewEvents(new Date()).success(function (res) {
                        $scope.eventList = res;
                    })
                });
            })
        } else {
            Api.newEvent(event).success(function () {
                Api.getNewEvents(new Date()).success(function (res) {
                    $scope.eventList = res;
                })
            })
        }
    }

    $scope.eventClicked = function (event) {
        Api.getEvent(event.id).success(function (res) {
            if ($scope.checkUsers(res)) {
                event.joined = true;
                $scope.$applyAsync();
            }
        })
        event.clicked = !event.clicked;
    }

    $scope.join = function (event) {
        if (!event.joined) {
            Api.addUserToEvent($rootScope.userID, event.id).success(function () {
                console.log("joined event " + event.id);
            });
            event.joined = true;
        } else {
            Api.removeUserFromEvent($rootScope.userID, event.id).success(function () {
                console.log("left event " + event.id);
            });
            event.joined = false;
        }
    }

    $scope.dateChanged = function (eventDate) {
        var date = new Date(eventDate);
        if (!$scope.prevDate) {
            $scope.prevDate = date;
            return true;
        }
        if ($scope.prevDate.getDate() !== date.getDate() && $scope.prevDate.getMonth() === date.getMonth()) {
            $scope.prevDate = date;
            return true;
        }
        return false;
    }

    $scope.dateToRelative = function (eventDate) {
        var date = new Date(eventDate);
        if ($scope.date.getMonth() === date.getMonth() && $scope.date.getDate() === date.getDate()) {
            return "Tänään";
        } else if($scope.date.getDate() + 1 === date.getDate()){
            //ei huomioi kuukauden vaihtumista
            return "Huomenna";
        }
        else {
            switch (date.getDay()) {
                case 0:
                    return "Sunnuntai";
                case 1:
                    return "Maanantai";
                case 2:
                    return "Tiistai";
                case 3:
                    return "Keskiviikko";
                case 4:
                    return "Torstai";
                case 5:
                    return "Perjantai";
                case 6:
                    return "Lauantai";
            }
        }

    }

    $scope.newNick = function (nick) {
        console.log("new nick: " + nick);

        Api.register(nick).success(function (res) {
            console.log(res);
            if (!res.error) {
                $scope.error = "";
                $rootScope.userID = res.id;
                $rootScope.userLoggedIn = res.username;
            } else {
                $scope.error = res.error;
            }
        }).error(function (data, status) {
            console.log("couldn't save nickname");
        });
    }



    $scope.wannaClicked = function (wanna) {
        console.log("Klikattiin wannaa: " + wanna.name);

        if (!wanna.clicked) {
            wanna.popularity += 1;
            wanna.clicked = true;
            $scope.userList.push(wanna);

            Api.updateWanna(wanna, {popularity: wanna.popularity}).success(function (res) {
                Api.addUserToWanna($rootScope.userID, wanna.id).success(function (res) {
                    console.log("added user to wanna");
                }).error(function () {
                    console.log("couldn't add user to wanna");
                });
            });

        } else {
            wanna.popularity -= 1;
            wanna.clicked = false;
            $scope.userList.splice($scope.userList.indexOf(wanna), 1);

            Api.updateWanna(wanna, {popularity: wanna.popularity}).success(function (res) {
                console.log(res);
                Api.removeUserFromWanna($rootScope.userID, wanna.id).success(function (res) {
                    console.log("removed user from wanna" + res);
                }).error(function () {
                    console.log("couldn't remove user from wanna");
                });
            }).error(function (err) {
                console.log(err);
            });

        }
        //$scope.$apply();
    }


})
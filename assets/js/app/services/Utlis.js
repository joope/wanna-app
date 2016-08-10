WannaApp.service('Utils', function (Api) {
    this.checkUsers = function (event) {
        for (w in event.users) {
            if (event.users[w].id === $rootScope.userID) {
                event.clicked = true;
                return true;
            }
        }
        return false;
    }

    this.oldEvent = function (event) {
        var current = new Date(event.date);
        current = current.setHours(current.getHours() + 1);
        if (current < new Date()) {
            return true;
        }
        return false;
    }

    this.dateChanged = function (eventDate) {
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

    this.dateToRelative = function (eventDate) {
        var date = new Date(eventDate);
        if ($scope.date.getMonth() === date.getMonth() && $scope.date.getDate() === date.getDate()) {
            return "Tänään";
        } else if ($scope.date.getDate() + 1 === date.getDate()) {
            //ei huomioi kuukauden vaihtumista
            return "Huomenna";
        } else {
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
    
    this.join = function (event) {
        if (!event.joined) {
            Api.addUserToEvent(event.id).success(function (res) {
                event.currentSize = event.currentSize + 1;
            });
            event.joined = true;
        } else {
            Api.removeUserFromEvent(event.id).success(function (res) {
                event.currentSize = event.currentSize - 1;
            });
            event.joined = false;
        }
    }
});
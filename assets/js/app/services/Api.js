WannaApp.service('Api', function ($http) {
    this.login = function () {
        return $http.post('/login');
    };
    this.register = function (username) {
        return $http.post('/register', {username: username});
    };
    
    // Group functions
    this.getGroup = function (groupID){
        return $http.get('/group/' + groupID);
    };
    this.getGroupEvents = function (groupID){
        return $http.get('/group/' + groupID + '/events');
    };
    this.getGroupUsers = function(groupID){
        return $http.get('/group/' + groupID + '/users');
    };
    this.joinGroup = function(groupID){
        return $http.post('/group/' + groupID + '/join');
    };
    this.leaveGroup = function(groupID){
        return $http.post('/group/' + groupID + '/leave');
    };
    
    this.getUserNotifications = function(){
        return $http.get('/user/notifications');
    };
    this.checkNotifications = function(){
        return $http.post('/user/checkNotifications');
    };
    
    this.getUserNew = function(){
        return $http.get('/event/getUserNew');
    };
    
    this.getWannas = function () {
        return $http.get('/wanna');
    };
    this.getPlaces = function (){
        return $http.get('/place');
    };
    this.getUserWannas = function (userID) {
        return $http.get('/user/' + userID + '/wannas');
    };
    this.getUserEvents = function (userID) {
        return $http.get('/event/getUserNew');
    };
    this.getNewEvents = function(date){
        return $http.get('/event/getNew', {'date': date});
    };

    this.getEvents = function () {
        return $http.get('/event/');
    };
    
    this.getEvent = function(eventID){
        return $http.get('/event/' + eventID);
    };
    this.getWannaEvents = function (wannaID) {
        return $http.get('/wanna/' + wannaID + '/events');
    };
    this.getEventsByName = function(name) {
        return $http.post('/event/getEventsByName', {'name': name});
    };

    this.newEvent = function (event) {
        return $http.post('/event/createWithWanna', event);
    };

    this.addEventToWanna = function (event, wannaID) {
        return $http.post('/wanna/' + wannaID + '/events', event);
    };

    this.updateWanna = function (wanna, json) {
        return $http.put('/wanna/' + wanna.id, json);
    };

    this.addWanna = function (wanna) {
        return $http.post('/wanna', wanna);
    };

    this.addUser = function (user) {
        return $http.post('/user', user);
    };

    this.addUserToWanna = function (userID, wannaID) {
        return $http.post('/wanna/' + wannaID + '/users/' + userID);
    };

    this.joinEvent = function (eventID) {
        return $http.post('/event/join', {'eventID': eventID});
    };

    this.removeUserFromWanna = function (userID, wannaID) {
        return $http.delete('/wanna/' + wannaID + '/users/' + userID);
    };

    this.leaveEvent = function (eventID) {
        return $http.post('/event/leave', {'eventID': eventID});
    };

});
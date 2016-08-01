WannaApp.service('Api', function($http){
    this.login = function(){
        return $http.post('/login');
    }
    this.register = function(username){
        return $http.post('/register', {username: username});
    }
    this.getWannas = function(){
        return $http.get('/wanna');
    }
    
    this.getUserWannas = function(userID){
        return $http.get('/user/' + userID + '/wannas');
    }
    this.getUserEvents = function(){
		return $http.get('/user/getEvents');
	}
	
    this.getEvents = function(){
        return $http.get('/event');
    }
    this.getWannaEvents = function(wannaID){
        return $http.get('/wanna/' + wannaID + '/events');
    }
    
    this.newEvent = function(event){
        return $http.post('/event', event);
    }
    
    this.addEventToWanna = function(event, wannaID){
        return $http.post('/wanna/' + wannaID + '/events', event);
    }
    
    this.updateWanna = function(wanna, json){
        return $http.put('/wanna/' + wanna.id, json);
    }
    
    this.addWanna = function(wanna){
        return $http.post('/wanna', wanna);
    }
    
    this.addUser = function(user){
        return $http.post('/user', user);
    }
    
    this.addUserToWanna = function(userID, wannaID){
        return $http.post('/wanna/' + wannaID + '/users/' + userID);
    }
    
    this.addUserToEvent = function(userID, eventID){
        return $http.post('/event/' + eventID + '/users/' + userID);
    }
    
    this.removeUserFromWanna = function(userID, wannaID){
        return $http.delete('/wanna/' + wannaID + '/users/' + userID);
    }
    
    this.removeUserFromEvent = function(userID, eventID){
        return $http.delete('/event/' + eventID + '/users/' + userID);
    }
    
})
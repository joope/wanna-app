WannaApp.service('Api', function($http){
    this.getWannas = function(){
        return $http.get('/wanna');
    }
    
    this.getUserWannas = function(userID){
        return $http.get('/user/' + userID + '/wannas');
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
    
    this.removeUserFromWanna = function(userID, wannaID){
        return $http.delete('/wanna/' + wannaID + '/users/' + userID);
    }
    
})
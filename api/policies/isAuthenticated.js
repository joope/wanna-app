module.exports = function isAuthenticated (req, res, next) {
    if(req.data.userID && req.isSocket){
        User.findOne(req.data.userID).then(function(user){
            if(!user){
                sails.sockets.broadcast(req.socket.id, 'newUser', {nick: "hola"});
            }
        }).catch(function(err){

        })
    }
    next();
}

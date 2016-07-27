module.exports = function(req, res, next) {
    if(req.session.userID){
        User.findOne({id: req.session.userID}).then(function(user){
//            if(!user){
//                sails.sockets.broadcast(req.socket.id, 'newUser', {nick: "hola"});
//            }
            if(user){
                next();
            }
        });
    } else{
        return res.forbidden('You are not permitted to perform this action.');
    }
}

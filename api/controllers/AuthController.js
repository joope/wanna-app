/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {
    _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },
    getAuth: function(req, res){
        var session = req.session;
            if (req.isSocket) {
            var handshake = req.socket.manager.handshaken[req.socket.id];
            if (handshake) {
                session = handshake.session;
            }
        }
    },
    logout: function(req, res) {
        req.logout();
        res.redirect('/');
    }
};


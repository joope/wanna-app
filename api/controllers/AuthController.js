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
    login: function (req, res) {
        if (req.user) {
            req.session.userID = req.user.id;
            return res.json({
                userID: req.user.id,
                username: req.user.username
            })
        }
        return res.json({newUser: true});
    },
    register: function (req, res) {
        User.findOne({username: req.body.username}, function (err, user) {
            if (err)
                return res.negotiate(err);
            if (user)
                return res.json({error: 'username taken!'});
            User.create({username: req.body.username}).exec(function (err, user) {
                if (user) {
                    req.session.userID = user.id;
                    return res.json(user);
                } else {
                    return res.json({error: "virhe luotaessa käyttäjää"});
                }
            })
        })

    },
    logout: function (req, res) {
        req.logout();
        req.session.destroy();
        res.redirect('/');
    }
};


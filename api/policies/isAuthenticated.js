var passport = require('passport');

module.exports = function (req, res, next) {
    //is socket
    if (req.session.userID) {
        User.findOne(req.session.userID).exec(function (err, user) {
            if (err || !user) {
                return res.redirect('/login');
            }
            return next();
        })

    } else {
        //regular http
        if (!req.user || !req.isAuthenticated()) {
            return res.redirect('/login');
        }
        return next();
    }
}

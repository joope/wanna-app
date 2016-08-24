/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require('passport');

module.exports = {
    authenticate: passport.authenticate('google', {scope: ['email profile']}),
    callback: passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' })
};


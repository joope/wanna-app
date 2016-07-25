/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var CLIENT_ID = '857777387430-r5foods4u21uvaqulbv2ccbjh6lkvqk3.apps.googleusercontent.com';
var CLIENT_SECRET = 'Z9Kd4vOyvOETfubDctenUE3o';
var REDIRECT_URL = 'localhost:1337/auth/google';

var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

var scopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/calendar'
];

var url = oauth2Client.generateAuthUrl({
  access_type: 'online', // 'online' (default) or 'offline' (gets refresh_token)
  scope: scopes // If you only need one scope you can pass it as string
});

module.exports = {
    login: function(req, res){
        return res.view('index', {
            currentDate: (new Date()).toString(),
            data: url
        });
    },
    new: function(req, res){
        return res.view('index', {
            currentDate: (new Date()).toString(),
            data: req.param("code")
        });
    }
};


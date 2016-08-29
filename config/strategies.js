var GoogleStrategy = require('passport-google-oauth20').Strategy;
var google = new GoogleStrategy({
    clientID: '857777387430-r5foods4u21uvaqulbv2ccbjh6lkvqk3.apps.googleusercontent.com',
    clientSecret: 'Z9Kd4vOyvOETfubDctenUE3o',
    callbackURL: "http://aurinkokuu.me:1337/auth/google/callback"
    },
    function (accessToken, refreshToken, profile, cb){
        console.log(profile.displayName + " logged in");
        User.findOrCreate({
            google_id: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value
            }, function (err, user) {
                return cb(err, user);
        });
    }
);

module.exports = {
    google: google
};


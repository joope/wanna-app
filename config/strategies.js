var GoogleStrategy = require('passport-google-oauth20').Strategy;
var google = new GoogleStrategy({
    clientID: '',
    clientSecret: '',
    callbackURL: ""
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


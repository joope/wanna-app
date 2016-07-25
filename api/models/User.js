/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcryptjs');

module.exports = {

  attributes: {
    username : {
        type : 'string',
        required: true,
        size: "32"
    },
    password : {
        type : 'string',
        required: true,
        minLength: 7
    },
    toJSON: function() {
        var obj = this.toObject();
        delete obj.password;
        return obj;
    },
    email: {
        type: 'email',
        required: true,
        unique: true
    },
    wannas : {
        collection: "Wanna",
        via: "users"
    },
    wannados: {
        collection: "Wannado",
        via: "users",
        dominant: true
    }
  },
  beforeCreate: function(user, cb) {
        bcrypt.genSalt(8, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    user.password = hash;
                    cb();
                }
            });
        });
    }
};


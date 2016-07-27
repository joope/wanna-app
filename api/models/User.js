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
        size: "32",
        minLength: 3,
        required: true,
        unique: true
    },
    password : {
        type : 'string',
        //required: true,
        minLength: 7
    },
    toJSON: function() {
        var obj = this.toObject();
        delete obj.password;
        return obj;
    },
    email: {
        type: 'email',
        //required: true,
        //unique: true
    },
    wannas : {
        collection: "Wanna",
        via: "users"
    },
    wannados: {
        collection: "Wannado",
        via: "users",
        dominant: true
    },
    poll: {
        model: "poll"
    }
  }
};


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
        minLength: 2,
	maxLength: 30,
        required: true
//        unique: true
    },
    firstName:{
        type: 'string'
    },
    lastName:{
        type: 'string'
    },
    google_id: {
        type: 'string'
    },
    toJSON: function() {
        var obj = this.toObject();
        delete obj.email;
        delete obj.google_id;
        delete obj.firstName;
        delete obj.lastName;
        return obj;
    },
    email: {
        type: 'email'
        //required: true,
        //unique: true
    },
    wannas : {
        collection: "Wanna",
        via: "users",
        dominant: true
    },
    events: {
        collection: "Event",
        via: "users",
        dominant: true
    },
    groups: {
        collection: "Group",
        via: "users",
        dominant: true
    },
    notifications: {
        collection: "Notification",
        via: "user"
    },
    lastNotificationCheck: {
        type: 'date'
    }
  }
};


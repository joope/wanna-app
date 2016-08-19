/**
 * Group.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
        name: {
            type: "string",
            required: true,
            unique: true,
            primaryKey: true,
            maxLength: 32
        },
        secret: {
            type: "string"
        },
        private: {
            type: "boolean",
            defaultsTo: false
        },
        events: {
            collection: "Event",
            via: "group"
        },
        users: {
            collection: "User",
            via: "groups"
        }
//        ,
//        messages: {
//            collection: "Message",
//            via: "group"
//        }
  }
};


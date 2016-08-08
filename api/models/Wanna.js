/**
 * Wanna.js
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
            maxLength: 30
        },
        popularity: {
            type: "integer",
            defaultsTo: 1
        },
        users: {
            collection: "User",
            via: "wannas"
        },
        events: {
            collection: "Event",
            via: "wanna"
        }
    }
};


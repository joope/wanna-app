/**
 * Wannado.js
 *
 * @description :: model for events, includes: all the stuff you need for having events
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
        wanna: {
            model: "Wanna"
//            required: true
        },
        name: {
            type: "string",
            required: true,
            maxLength: 32
        },
        date: {
            type: "date",
            required: true
        },
        place: {
            type: "string",
            required: true
        },
        creator: {
            model: "User"
        },
        users: {
            collection: "User",
            via: "events"
        },
        ready: {
            type: "boolean",
            defaultsTo: false
        },
        currentSize: {
            type: "integer",
            defaultsTo: 1
        },
        maxSize: {
            type: "integer",
            defaultsTo: 16
        },
        minSize: {
            type: "integer",
            defaultsTo: 4
        },
        info: {
            type: "string",
            maxLength: 128
        }
    }
};


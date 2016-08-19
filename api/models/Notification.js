/**
 * Notification.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
        user: {
            model: "User"
        },
        message: {
            type: "string",
            maxLength: 128
        },
        type: {
            type: "string",
            enum: ['success', 'alert', 'warning', 'info', 'default']
        },
        event: {
            model: "Event"
        },
        triggered: {
            model: "User"
        }
    }
};


/**
 * Wannado.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
      wanna: {
          model: "Wanna",
          required: true
      },
      date: {
          type: "date",
          required: true
      },
      place: {
          type: "string",
          required: true
      },
      users: {
          collection: "User",
          via: "events"
      },
      ready: {
          type: "boolean",
          defaultsTo : false
      },
	  currentSize: {
		  type: "integer",
		  defaultsTo: 1
	  },
      maxSize: {
          type: "integer",
          defaultsTo: 12
      },
      minSize : {
          type: "integer",
          defaultsTo: 2
      }
  }
};


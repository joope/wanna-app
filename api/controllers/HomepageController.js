 /**
 * IndexController
 *
 * @description :: Server-side logic for managing indices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    index: function (request, response) {
        return response.view('index', {
          currentDate: (new Date()).toString(),
          data: "testiä vaan"
        });
  }
};


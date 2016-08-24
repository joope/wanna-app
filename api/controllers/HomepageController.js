/**
 * IndexController
 *
 * @description :: Server-side logic for managing indices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    index: function (req, res) {
        if (req.user) {
            return res.view('index');
        } else {
            return res.redirect('/login');
        }
    }
};


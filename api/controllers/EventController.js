/**
 * WannadoController
 *
 * @description :: Server-side logic for managing wannadoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getUserEvents: function(req, res){
		var json;
		User.query('SELECT * FROM event');
		return res.json(json);
	}
};


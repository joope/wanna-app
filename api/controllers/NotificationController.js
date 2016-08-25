/**
 * NotificationController
 *
 * @description :: Server-side logic for managing notifications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getNotifications: function (req, res) {
        if (!req.isSocket) {
            return res.send(403);
        }
        //rajoita notifikaatioiden määrää
        User.findOne(req.session.userID).populate('notifications').populate('events').exec(function (err, results) {
            if (err) {
                return res.send(500);
            }
            //subscribe socket to all events it has joined
            Event.subscribe(req, _.pluck(results['events'], 'id'));
            Wanna.subscribe(req, _.pluck(results['wannas'], 'id'));
            res.json(results);
        });
    },
    checkNotifications: function (req, res) {
        console.log("checking notifs: " + req.user.id);
        var user = req.user.id;
        User.update({id: user}, {lastNotificationCheck: new Date()}).exec(function(err, lol){
            if(!err){
                console.log("success");
            }
            console.log(err, lol);
            res.ok();
        });
        
    }
};


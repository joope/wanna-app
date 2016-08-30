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
        //pitäisi rajoita notifikaatioiden määrää
        User.findOne(req.session.userID).populate('notifications').populate('events').populate('wannas').exec(function (err, results) {
            if (err) {
                return res.send(500);
            }
            //subscribe user to all events/wannas it's connected
            Event.subscribe(req, _.pluck(results['events'], 'id'));
            Wanna.subscribe(req, _.pluck(results['wannas'], 'id'));
//            sails.sockets.join(req, 'EventListener');

            res.json(results);
        });
    },
    checkNotifications: function (req, res) {
        var user = req.user.id;
        User.update({id: user}, {lastNotificationCheck: new Date()}).exec(function (err, lol) {
            if (!err) {
                res.send(200);
            } else {
                res.send(404);
            }
        });
    },
    unsubscribe: function (req, res) {
        if (!req.isSocket) {
            return res.send(403);
        }
        Wanna.unsubscribe(req, [req.params.id]);
        Event.unsubscribe(req, [req.params.id]);
        return res.ok();
    }
};


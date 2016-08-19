/**
 * NotificationController
 *
 * @description :: Server-side logic for managing notifications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getNotifications: function (req, res) {
        var user = req.session.userID;
        if (!req.isSocket) {
            return res.send(403);
        }
        //rajoita notifikaatioiden määrää
        User.findOne(user).populate('notifications').populate('events').exec(function (err, results) {
            if (err) {
                return res.send(500);
            }
            Event.subscribe(req, _.pluck(results['events'], 'id'));
            Wanna.subscribe(req, _.pluck(results['wannas'], 'id'));
            res.json(results);
        });
    },
    checkNotifications: function (req, res) {
        var user = req.session.userID;
        User.update({id: user}, {lastNotificationCheck: new Date()});
        res.ok();
    }
};


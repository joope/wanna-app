/**
 * WannadoController
 *
 * @description :: Server-side logic for managing wannadoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    join: function (req, res) {
        var user = req.session.userID;
        var eventID = req.body['eventID'];
        Event.findOne(eventID).populate('users').exec(function (err, event) {

            if (err)
                return res.json({error: 'error when joining event'});

            if (!event)
                return res.json({error: 'no such event'});

            if (event.currentSize >= event.maxSize) {
                return res.json({error: 'event is full'});
            }

            if (event.currentSize + 1 >= event.minSize) {
                event.ready = true;
                Event.message(event.id, {verb: "event confirmed"});
            }
            event.currentSize = event.currentSize +1;
            event.users.add(user);
            event.save(function (err) {
                if (err) {
                    return res.json({error: 'couldnt join the event'});
                }
                Event.message(event.id, {verb: "user joined event"});
                return res.ok();
            });
        });
    },
    leave: function (req, res) {
        var user = req.session.userID;
        var eventID = req.body['eventID'];
        Event.findOne(eventID).populate('users').exec(function (err, event) {

            if (err)
                return res.json({error: 'error when leaving event'});

            if (!event)
                return res.json({error: 'no such event'});

            if (event.ready) {
                return res.json({error: 'cannot leave event that is ready'});
            }
            event.users.remove(user);
            event.currentSize = event.currentSize -1;
            event.save(function (err) {
                if (err) {
                    return res.json({error: 'couldnt leave the event'});
                }
                Event.message(event.id, {verb: "user left event"});
                return res.ok();
            });
        })
    },
    getNew: function (req, res) {
        var date = new Date();
        date.setHours(date.getHours() - 1);
        Event.find({ date: { '>=': date} }).populate('wanna').exec(function(err, events){
            if(err){
                return res.json({error: 'error when retrieving events'});
            }
            return res.json(events);
        })
    }

};


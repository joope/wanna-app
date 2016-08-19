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
        var name;
        User.findOne(user).exec(function (err, user) {
            name = user.username;
        });
        
        Event.findOne(eventID).populate('users').exec(function (err, event) {
            var json = event.toJSON();
            if (err)
                return res.json({error: 'error when joining event'});

            if (!event)
                return res.json({error: 'no such event'});

            Wanna.findOne({name: event.name}).exec(function (err, wanna) {
                //add wanna of event to users collection
                wanna.users.add(user);
                wanna.save(function (err) {
                    if (err) {
                        //user already subscribed to wanna
                    }
                });
            });

            if (event.currentSize >= event.maxSize) {
                return res.json({error: 'event is full'});
            }

            if (event.currentSize + 1 >= event.minSize) {
                event.ready = true;
            }
            event.currentSize = event.currentSize + 1;
            event.users.add(user);
            event.save(function (err) {
                if (err) {
                    return res.json({error: 'couldnt join the event'});
                }
                
                if (event.currentSize === event.minSize) {
                    Event.message(event.id, "Tapahtuma '" + event.name + "' varmistui!");
                    HelperService.notificateUsers(json, event.name + " varmistui!", "success", user);
                } else {
                    Event.message(event.id, name + " osallistui myös tapahtumaan " + event.name);
                    HelperService.notificateUsers(json, name + " osallistui myös tapahtumaan " + event.name, "default", user);
                }
                return res.ok();
            });
        });
    },
    leave: function (req, res) {
        var user = req.session.userID;
        var eventID = req.body['eventID'];
        var name;
        User.findOne(user).exec(function (err, user) {
            name = user.username;
        });
        
        Event.findOne(eventID).populate('users').exec(function (err, event) {

            if (err)
                return res.json({error: 'error when leaving event'});

            if (!event)
                return res.json({error: 'no such event'});

            if (event.ready) {
                return res.json({error: 'cannot leave event that is ready'});
            }
            event.users.remove(user);
            event.currentSize = event.currentSize - 1;
            event.save(function (err) {
                if (err) {
                    return res.json({error: 'couldnt leave the event'});
                }
                Event.message(event.id, name + " lähti tapahtumasta " + event.name);
                HelperService.notificateUsers(json, name + " lähti tapahtumasta " + event.name, "warning", user);
                return res.ok();
            });
        })
    },
    getNew: function (req, res) {
        var date = new Date();
        date.setHours(date.getHours() - 1);
        Event.find({date: {'>=': date}}).populate('wanna').exec(function (err, events) {
            if (err) {
                return res.json({error: 'error when retrieving events'});
            }
            return res.json(events);
        })
    },
    createWithWanna: function (req, res) {
        //should check input here
        Wanna.findOrCreate({name: req.body['name']}, {name: req.body['name']}).exec(function (err, wanna) {
            //add user to wannas user-list
            wanna.users.add(req.session.userID);
            wanna.save(function (err) {
                if (err) {
                    //user already subscribed to wanna
                }
            });
            //add user to event's user-list
            req.body['users'] = [req.session.userID];
            req.body['creator'] = req.session.userID;
            Event.create(req.body).exec(function (err, event) {
                if (!err) {
                    return res.json(event);
                } else {
                    return res.send(500);
                }
            });
        })
    },
    getEventsByName: function (req, res) {
        var name = req.body['name'];
        if (name) {
            Event.find({name: name}).exec(function (err, results) {
                return res.json(results);
            })
        } else {
            return res.send(404);
        }
    }

};


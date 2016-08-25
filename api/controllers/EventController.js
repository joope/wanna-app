/**
 * WannadoController
 *
 * @description :: Server-side logic for managing wannadoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    join: function (req, res) {
        var user = req.user.id;
        var eventID = req.body['eventID'];
        var name;
        User.findOne(user).exec(function (err, user) {
            name = user.username;
        });

        Event.findOne(eventID).populate('users').exec(function (err, event) {
            if (err) {
                return res.json({error: 'error when joining event'});
            }
            if (!event) {
                return res.json({error: 'no such event'});
            }

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
            event.users.add(user);
            event.currentSize = event.currentSize + 1;
            var json = event.toJSON();
            event.save(function (err) {
                if (err) {
                    return res.json({error: 'couldnt join the event'});
                }

                if (event.currentSize === event.minSize) {
                    Event.message(event.id, "Tapahtuman '" + event.name + "' osallistujia on nyt tarvittava määrä!");
                    HelperService.notificateUsers(json, "Tapahtuman '" + event.name + " osallistujia on nyt tarvittava määrä!", "success", user);
                } else {
                    Event.message(event.id, name + " osallistui myös tapahtumaan " + event.name);
                    HelperService.notificateUsers(json, name + " osallistui myös tapahtumaan " + event.name, "default", user);
                }
                return res.json(event);
            });
        });
    },
    leave: function (req, res) {
        var user = req.user.id;
        var eventID = req.body['eventID'];
        var name;
        User.findOne(user).exec(function (err, user) {
            name = user.username;
        });

        Event.findOne(eventID).populate('users').exec(function (err, event) {
            var date = new Date();
            if (err)
                return res.json({error: 'error when leaving event'});

            if (!event)
                return res.json({error: 'no such event'});

            if (event.date < date) {
                return res.json({error: 'cannot leave event that begins in 2 hours'});
            }
            event.users.remove(user);
            event.currentSize = event.currentSize - 1;
            var json = event.toJSON();
            event.save(function (err) {
                if (err) {
                    return res.json({error: 'couldnt leave the event'});
                }
                Event.message(event.id, name + " lähti tapahtumasta " + event.name);
                HelperService.notificateUsers(json, name + " lähti tapahtumasta " + event.name, "warning", user);
                return res.json(event);
            });
        })
    },
    getNew: function (req, res) {
        var d = new Date();
        d = (d.getTime() - 1000 * 60 * 60);
        var date = new Date(d);
        Event.find({date: {'>=': date}}).populate('wanna').exec(function (err, events) {
            if (err) {
                return res.json({error: 'error when retrieving events'});
            }
            return res.json(events);
        })
    },
    getUserNew: function (req, res) {
//        var d = new Date();
//        d = (d.getTime() - 1000 * 60 * 60);
//        d = new Date(d);
        //ei toimi :(
        User.findOne(req.user.id).populate('events').exec(function (err, user) {
            if (err) {
                return res.json({error: 'error when retrieving events'});
            }
            return res.json(user.events);
        })
    },
    createWithWanna: function (req, res) {
        var name;
        User.findOne(req.user.id).exec(function (err, user) {
            name = user.username;
        });
        //should check input here
        Wanna.findOrCreate({name: req.body['name']}, {name: req.body['name']}).exec(function (err, wanna) {
            //add user to wannas user-list
            if (err) {
                //probably weird input
                res.json({error: 'Ei voitu luoda tapahtumaa koska'});
            }
            Place.findOrCreate({name: req.body['place']}, {name: req.body['place']}).exec(function (err, place) {
                place.popularity = place.popularity + 1;
            })
            wanna.popularity = wanna.popularity + 1;
            wanna.users.add(req.user.id);
            wanna.save(function (err) {
                if (err) {
                    //user already subscribed to wanna
                }
            });
            //add user to event's user-list
            req.body['users'] = [req.user.id];
            req.body['creator'] = name;
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


/**
 * GroupController
 *
 * @description :: Server-side logic for managing groups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    join: function (req, res) {
        var user = req.session.userID;
        var groupID = req.param['group'];

        Group.findOne(groupID).exec(function (err, group) {
            if (group.private) {
                //ask password or something
            }
            group.users.add(user);
            group.save(function (err) {
                if (err) {
                    return res.json({error: 'couldnt join the group'});
                }
                Group.message(group.id, {verb: "user joined group"});
                return res.ok();
            });

        })
    },
    leave: function (req, res) {
        var user = req.session.userID;
        var groupID = req.param['group'];

        Group.findOne(groupID).exec(function (err, group) {
            if (group.private) {
                //ask password or something
            }
            group.users.remove(user);
            group.save(function (err) {
                if (err) {
                    return res.json({error: 'couldnt leave the group'});
                }
                Group.message(group.id, {verb: "user left group"});
                return res.ok();
            });

        })
    },
    
    addEvent: function (req, res) {
        var user = req.session.userID;
        var groupID = req.param['group'];
        var event = req.body['event'];
        
        Group.findOne(groupID).populate('users').exec(function (err, group) {
            //check that user is part of group
            if(group.users.indexOf(user) === -1){
                return res.send(403);
            }
            group.events.add(event);
            group.save(function (err) {
                if (err) {
                    return res.json({error: 'couldnt add event'});
                }
                Group.message(group.id, {verb: "newEvent", event:event});
                return res.ok();
            });

        })
    },
    //not implemented yet
    addMessage: function(req, res){
        var user = req.session.userID;
        var groupID = req.param['group'];
        var message = req.body['message'];
        
        Group.findOne(groupID).populate('users').exec(function (err, group) {
            //check that user is part of group
            if(group.users.indexOf(user) === -1){
                return res.send(403);
            }
            group.messages.add(message);
            group.save(function (err) {
                if (err) {
                    return res.json({error: 'couldnt add event'});
                }
                Group.message(group.id, {verb: "newEvent", event:event});
                return res.ok();
            });

        })
    }
};


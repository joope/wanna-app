/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

module.exports = {
    notificateUsers: function (object, message, type, triggered) {
        if (object.users) {
            for (u in object.users) {
                //dont send notification to user who triggered it
                if (object.users[u].id !== triggered) {
                    Notification.create({
                        user: object.users[u].id,
                        message: message,
                        type: type,
                        triggered: triggered
                    }).exec(function (err, notf) {

                    });
                }
            }
        }
    }
}

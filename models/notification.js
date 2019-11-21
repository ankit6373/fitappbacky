var mongoose = require('mongoose');

var Notification = new mongoose.Schema({
    noti_type : {
	    type  : String
	},
	recipe_id  : {
	    type  : String
	},
	postid    : {
	    type  : String
	},
	byuser    : {
	    type  : Array
	},
	commentid : {
	   type  : String
	},
	content   : {
	   type  : String
	}
});

//var Notification = mongoose.model('Notification',NotificationSchema);

module.exports = Notification;
var mongoose = require('mongoose');
const User     = require('./users');

var DoubtSchema =  new mongoose.Schema({
    heading : {
        type : String
    },
    postedby : {
        type : mongoose.Schema.Types.ObjectId,
		ref  : 'User'
    },
    details  : {
        type : String
    },
    tags     : {
        type : Array
    },
    Comments : [{
		commentedUser : {
			type : mongoose.Schema.Types.ObjectId,
		    ref  : 'User'
		},
		comment : {
			type : String
		},
		replies : [{
			repliedUsers : {
			    type : mongoose.Schema.Types.ObjectId,
		        ref  : 'User'
		    },
		    reply : {
			    type : String
		    }
		}]
	}]
},{
	timestamps : true
});

var Doubt = mongoose.model('Doubt',DoubtSchema);
module.exports = {Doubt};
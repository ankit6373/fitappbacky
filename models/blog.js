var mongoose = require('mongoose');

var BlogSchema  = new mongoose.Schema({

    title : {
		type : String
	},
	author : {
		type : String
	},
	author_insta : {
		type : String
	},
	author_google : {
		type : String
	},
	intro : {
		type : String
	},
	title_pic : {
		type : String
	},
	body_para : [
	    title  : {
			type : String
		},
		content : {
			type : String
		},
		image : {
			type : String
		},
		lists : [
		    list_item : {
				type : String
			}
		]
	],
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

var Blog = mongoose.model('Blog',BlogSchema);

module.exports = {Blog};
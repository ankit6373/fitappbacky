var mongoose       = require('mongoose');
const User         = require('./users');
const Ingredient   = require('./ingredient');

var RecipeSchema = new mongoose.Schema({

    ingredients : [Ingredient],
	making : {
	    type : Array
	},
	pic  : {
	    type : String
	},
	macros : {
	    type : Array
	},
	type : {
	   type : String
	},
	forpeople : {
	   type : String
	},
	approved : {
		type    : Boolean,
		default : false
	},
	additional_comments : {
		type  : String
	},
	postedby : {
		type : mongoose.Schema.Types.ObjectId,
		ref  : 'User'
	},
	Likers  : [{
		type : mongoose.Schema.Types.ObjectId,
		ref  : 'User'
	}],
	helpfulcount : {
        type : Number
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
	}],
	commentscount : {
		type  : Number
	},
	suggestions : [{
		by : {
			type : mongoose.Schema.Types.ObjectId,
		    ref  : 'User'
		},
		suggestion : {
            type  : String
		}
	}]
	
},{
	timestamps : true
});

var Recipe = mongoose.model('Recipe',RecipeSchema);

module.exports = {Recipe};


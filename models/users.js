var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const Recipe  = require('./recipe');
const Doubt   = require('./doubt');
const Notification   = require('./notification');

var UserSchema = new mongoose.Schema({

	firstname  : {
		type  : String
	},
	lastname   : {
		type   : String
	},
	password  : {
		type      : String,
		minlength : 8,
		maxlength : 100
	}, 
	country   : {
		type  : String
	},
	bio       : {
		type  : String
	},
	level     : {
		type  : String
	},
	profile_url : {
		type    : String,
		unique  : true
	},
	email     : {
		type    : String,
		unique  : true
	},
	fit_category : {
		type  : String
	},
	goal      : {
		type  : String
	},
	dp        : {
		type  : String
	},
	myrecipes : [{
        type  : mongoose.Schema.Types.ObjectId,
		ref   : 'Recipe'
	}],
	mydoubts  : [{
		type  : mongoose.Schema.Types.ObjectId,
		ref   : 'Doubt'
	}],
	emailtoken : {
		type    : String,
		unique  : true
	},
	password_resettoken : {
		type    : String
	},
	myfollowingrecipes : [{
		type  : mongoose.Schema.Types.ObjectId,
		ref   : 'Recipe'
	}],
	isAdmin : {
		type    : Boolean,
		default : false
	},
	myfollowers : [{
		type  : mongoose.Schema.Types.ObjectId,
		ref   : 'User'
	}],
	myfollowing : [{
		type  : mongoose.Schema.Types.ObjectId,
		ref   : 'User'
	}],
	notifications : [Notification]

});

UserSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id : this._id,isAdmin: this.isAdmin},'yoo_sidhumoosewala');
    return token
}

var User = mongoose.model('User',UserSchema);

module.exports = {User};
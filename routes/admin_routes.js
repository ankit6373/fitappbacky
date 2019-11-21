var express              = require('express');
var admin_route          = express.Router();
var bodyParser           = require('body-parser');
const Joi                = require('joi');
var jwt                  = require('jsonwebtoken');
const nodemailer         = require('nodemailer');
const cryptoRandomString = require('crypto-random-string');
var {mongoose}           = require('../db/mongoose.js');
var {User}               = require('../models/users');
const _                  = require('lodash');
const bcrypt             = require('bcrypt');
const admin_auth         = require('../middleware/admin_auth');
var { Recipe }           = require('../models/recipe');

var { User }             = require('../models/users');
var Notification         = require('../models/notification');

let transporter = nodemailer.createTransport({
	host: 'smtp.mailtrap.io',
    port: 	2525,
    secure: false, // true for 465, false for other ports
    auth: {
        user: '70c7b3d3ecdeb5', 
        pass: '1512315b563171' 
    }
});


admin_route.get('/admin-get-pendingrecipes/:pageno',admin_auth,async(req,res) => {
    var pageno   = req.params.pageno;
    var perpage  = 3
    var skipdata = (pageno - 1)*perpage
   
    const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
    }
    
    try{
        var pendingrecipes = await Recipe.find({ approved : false }).skip(skipdata).limit(perpage);
        return res.status(200).send(pendingrecipes);
    }catch(error){
        return res.status(400).send(error);
    }
    

});

admin_route.post('/approve-recipe/:recipeid',admin_auth,async(req,res) => {
    
    const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
    }

    var recipeid = req.params.recipeid;
	
	try{
		//const updatedrecipe = findOneAndUpdate
		// update the recipe with new edits
		/*
		if the operation is successul then create a notification model n 
		push it into users.notification
		*/
		var noti = new Notification({
			noti_type      : 'repcipe_approved',
			recipe_id       : recipeid,
			content        : 'Your Recipe has been approved'
		});
		
		try{
			var noti_saved = noti.save();
			return res.status(200).send({'msg' : 'Recipe saved n notification sent'})
		}catch(e){
			return res.status(400).send(e);
		}
	}catch(e){
		return res.status(400).send(e);
	}

    console.log(recipeid,req.body.carbs,req.body.protien,req.body.fat,req.body.calories,req.body.comments);

});

module.exports = admin_route;
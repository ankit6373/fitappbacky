var express     = require('express');
var user_route  = express.Router();
const Joi       = require('joi');
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cryptoRandomString = require('crypto-random-string');
var {mongoose}   = require('../db/mongoose.js');
var {User}      = require('../models/users');
var { Doubt }   = require('../models/doubt');
var { Recipe }  = require('../models/recipe');
var multer  = require('multer');

const user_auth = require('../middleware/user_auth');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
	  cb(null,Date.now() + file.originalname )
	}
})

var upload = multer({  storage: storage  });

// Route to post diet

user_route.post('/post-diet',user_auth,async(req,res) => {
	//return res.status(200).send(req.body);
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
 
    var recipe = new Recipe({
		forpeople   : req.body.forpeople,
		type        : req.body.type,
		ingredients : req.body.ingredients,
		making      : req.body.making,
		postedby    : user
	})

	try{
		const savedrecipe = await recipe.save();
		try{
		   user.myrecipes.push(savedrecipe);
		   user.save();
		   return res.status(200).send(savedrecipe);
		}catch(error){
			return res.status(400).send(error);
		}
	}catch(error){
        return res.status(400).send(error);
	}
	
});

user_route.post('/post-dietimage/:recipeid',upload.single('recipeimage'),user_auth,async(req,res) => {
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}

	

	if(!recipe){
       return res.status(400).send('No Recipe Found');
	}else{
		recipe.set({
			pic : 'http://localhost:3000/' + req.file.filename
		})

		try{
		   const savedrecipe = await recipe.save();
		   return res.status(200).send(savedrecipe);
		}catch(error){
           return res.status(400).send(error);
		}
	}

	
});


user_route.post('edit-userinfo',user_auth,async(req,res) => {
    const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}

});

user_route.post('/post-doubt',user_auth,async(req,res) => {
    const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}

	var doubt = new Doubt({
		heading   : req.body.heading,
		postedby  : req.user._id,
		details   : req.body.details,
		tags      : req.body.tags
	});

	try{
		var doubtsaved = await doubt.save();
		try{
            user.mydoubts.push(doubtsaved);
			user.save();
			return res.status(200).send(doutsaved);
		}catch(error){
			return res.status(400).send(doubtsaved);
		}
	}catch(error){
		return res.status(400).send(error);
	}
	

});

user_route.post('change-dp',user_auth,upload.single('dp'),async(req,res) => {
    const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}

});

user_route.get('get-mydiets',user_auth,async(req,res) => {
    const user = await User.findById(req.user._id).select('myrecipes');
	
	if(!user){
		return res.status(400).send('User Not Found');
	}

	return res.status(200).send(user);

});

user_route.get('/markhelpful/:recipeid',user_auth,async(req,res) => {
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}

	var recipeid = req.param('recipeid');
   // console.log(recipeid);
	
	// check if recipe id is in the user's myrecipe 
	if(user.myrecipes.indexOf(recipeid) > -1){
		return res.status(400).send('You cant mark ur own recipe');
	}

	var recipe = await Recipe.findById(recipeid);	
	
	if(recipe.Likers.indexOf(user._id) > - 1){

		try{
            const saverecipe = await Recipe.findByIdAndUpdate(recipeid,{
				$pull : { 'Likers' : user._id },
				$inc  : { 'helpfulcount' : -1  }
			});

			return res.status(200).send({ 'msg' : 'Marked Unhelpful'});

		}catch(error){
           return res.status(400).send(error);
		}
	}else{

        try{
			const saverecipe = await Recipe.findByIdAndUpdate(recipeid,
				{
				$push : { 'Likers' : user },
				$inc  : { 'helpfulcount' : 1 }
			   }
			);
			return res.status(200).send({ 'msg' : 'Marked Helpful' });

		}catch(error){
			return res.status(400).send(error);
		}

	}

});

user_route.post('comment-on-recipe/:recipeid',user_auth,async(req,res) => {
    const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}

	// store recipe id in a variable



});

user_route.post('reply-to-comment',user_auth,async(req,res) => {
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}

});

user_route.post('comment-on-doubt',user_auth,async(req,res) => {
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}

});

user_route.post('reply-to-commentdoubt',user_auth,async(req,res) => {
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}

});

user_route.post('makingitbetter/:recipeid',user_auth,async(req,res) => {
    const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
});

module.exports = user_route;
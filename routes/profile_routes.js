var express     = require('express');
var profile_route  = express.Router();

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

//route to get my basic info

profile_route.get('/get-my-basic-info',user_auth,async(req,res) => {
	const user = await User.findById(req.user._id).select('firstname lastname country bio dp profile_url goal email');
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	return res.status(200).send(user);
});

// route to get user's basic info

profile_route.get('/get-user-basic-info/:url',async(req,res) => {
	
	const profileurl = req.params.url;
		
	const user = await User.findOne({profile_url : profileurl}).select('firstname lastname country bio dp goal profile_url level ');
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	return res.status(200).send(user);
});


// route to update dp

profile_route.post('/update-mydp',upload.single('dp'),user_auth,async(req,res) => {
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	user.set({
		dp : 'http://localhost:3000/' + req.file.filename
	})
	
	try{
		user.save();
		return res.status(200).send(user);
	}catch(e){
		return res.status(400).send(e);
	}
	
});


// route to update my info

profile_route.post('/update-about',user_auth,async(req,res) => {
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	user.set({
		bio : req.body.about
	});
	
	try{
		user.save();
		return res.status(200).send(user);
	}catch(e){
		return res.status(400).send(e);
	}
	
});

// route to get users's shared recipes

profile_route.get('/get-users-recipes/:url',async(req,res) => {
	
	const profileurl = req.params.url;
	
	const user = User.findOne({profile_url : profileurl})
	
	
	return res.status(200).send(user);
});


// route to get my shared recipes

profile_route.get('/get-my-recipes/:pageno',user_auth,async(req,res) => {
	
	var pageno   = req.params.pageno;
    var perpage  = 5
    var skipdata = (pageno - 1)*perpage
	
    const user = await User.findById(req.user._id)
	                        .populate({
							   path : 'myrecipes',
							   model : 'Recipe',
							   match : { approved : true }
						    }).skip(skipdata).limit(perpage);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	return res.status(200).send(user.myrecipes);
});

profile_route.get('/get-my-followingrecipes/:pageno',user_auth,async(req,res) => {
	
	var pageno   = req.params.pageno;
    var perpage  = 5
    var skipdata = (pageno - 1)*perpage
	
	const user = await User.findById(req.user._id)
	                       .populate({
							   path : 'myfollowingrecipes',
							   model : 'Recipe'
						   }).skip(skipdata).limit(perpage);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	
	return res.status(200).send(user.myfollowingrecipes);
});

// route to get my followers n followings

profile_route.get('/get-my-followerscount',user_auth,async(req,res) => {
	
	const user = await User.findById(req.user._id)
	                       
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	var followerscount = user.myfollowers.length;
	
	return res.status(200).send({'followers_count' : followerscount});
});


profile_route.get('/get-my-followingcount',user_auth,async(req,res) => {
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
    var followingcount =  user.myfollowing.length;
	
	return res.status(200).send({'following_count' : followingcount});
});

// route to get user's following diets


// route to get user's recipe


//route to get user's followers n followings


// route to follow someone

profile_route.get('follow-me/:id',user_auth,async(req,res) => {
	
	const followuserid = req.params.id;
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}

    const followuser = await User.findById(followuserid);

    // check if requested user is allready following this user
    
    if(user.myfollowing.indexOf(followerid) > -1 ){
		return res.status(400).send('Already followed')
	}else{
		
		// push into users myfollowing array
		user.myfollowing.push(followuser);
		// push into followerusers myfollowers array
		followeruser.myfollowers.push(user);
		
		try{
			user_saved   = await user.save();
			follow_saved = await followeruser.save();
			
			const success = await Promise.all(user_saved,follow_saved);
			return res.status(200).send(success);
		}catch(e){
			return res.status(400).send(e);
		}
		
	}	
	
});


// route to unfollow someone

profile_route.get('unfollow-me/:id',user_auth,async(req,res) => {
	
	const unfollowuserid = req.params.id;
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	const unfollowuser = await User.findById(unfollowuserid);
	
});

module.exports = profile_route;
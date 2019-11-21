var express     = require('express');
var auth_route  = express.Router();
var bodyParser = require('body-parser');
const Joi       = require('joi');
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cryptoRandomString = require('crypto-random-string');
var {mongoose}   = require('../db/mongoose.js');
var {User}      = require('../models/users');
const _  = require('lodash');
const bcrypt    = require('bcrypt');

let transporter = nodemailer.createTransport({
	host: 'smtp.mailtrap.io',
    port: 	2525,
    secure: false, // true for 465, false for other ports
    auth: {
        user: '70c7b3d3ecdeb5', 
        pass: '1512315b563171' 
    }
})

var fronturl = 'localhost:4200';

auth_route.get('/test',(req,res) => {
    res.send('Its Working');
});

auth_route.post('/user-signup',async(req,res) => {
	

	var user =  await User.findOne({email: req.body.email});
	
	if(user){
		return res.status(400).send('Email is already registered');
	}
		
	const salt          = await bcrypt.genSalt(10);
	const hash_password = await bcrypt.hash(req.body.password,salt);
	
	var random_string = cryptoRandomString({length: 10, type: 'url-safe'});
	var url_string    = cryptoRandomString({length: 6 , type: 'url-safe'});
	
	var url = req.body.firstname.toLowerCase() + req.body.lastname.toLowerCase() +'-' + url_string;
	
	user = new User({
		firstname   : req.body.firstname,
		lastname    : req.body.lastname,
		password    : hash_password,
		email       : req.body.email,
		profile_url : url,
		country     : req.body.country,
		category    : req.body.category,
		goal        : req.body.goal,
		emailtoken  : random_string
	});
	
	try{
		let saveduser = await user.save();
	    
		
		if(saveduser){
			
			/*
			var message =  {
		        from    : 'health@noreply.com',
		        to      :  saveduser.email,
		        subject : 'Verify Email',
		        text    : 'Click here to verify your email',
		        html    : 
		           '<div>  <a href="localhost:4200/profile/' + saveduser.profile_url + '/' + saveduser.emailtoken +' "> Click this button to verify</a>    </div>'
	        };
	
			
	         transporter.sendMail(message,(error,info) => {
                if (error) {
                    return console.log(error);
                }else{
			        console.log('Message sent: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		        }        		
	        });
			*/
			
			const token = saveduser.generateAuthToken();
	    
	        return res.status(200).send({ 'auth_token' : token});
			
		}
		
	}catch(err){
		return res.status(400).send(err);
	}
		
	//user = new User(_.pick(req.body,['fullname','email','password']))

});

auth_route.get('/user-verify',async(req,res) => {
	
	//console.log(req.query.profile_url);
	//console.log(req.query.emailtoken);
	
	
	
	var user = await User.findOne({ profile_url : req.query.profile_url,emailtoken : req.query.emailtoken});
	try{
		const token = user.generateAuthToken();	
	    return res.status(200).send(token);
	}catch(error){
		return res.status(400).send(error);
	}
	
	/*
	if(user){
		const token = user.generateAuthToken();	
	    return res.status(200).send(token);
	}else{
		return res.status(400).send('Error');
	}
	*/
	const token = user.generateAuthToken();	
	return res.status(200).send(token);
	//return res.status(200).send(user);
	
});

auth_route.post('/user-login',async(req,res) => {
	
	let user = await User.findOne({ email : req.body.email });
	
	if(!user){
		return res.status(400).send('Incorrect Email')
	}
	
	const validpassword =  await bcrypt.compare(req.body.password,user.password);
	
	if(!validpassword){
		return res.status(400).send('Incorrect Password');
	}


	const token = user.generateAuthToken();	
	return res.status(200).send({ 'auth_token' : token});
	
	
	
	
});


auth_route.post('/moosewala-signup',async(req,res) => {
	var user =  await User.findOne({email: req.body.email});
	
	if(user){
		return res.status(400).send('Email is already registered');
	}
		
	const salt          = await bcrypt.genSalt(10);
	const hash_password = await bcrypt.hash(req.body.password,salt);

    user = new User({
		email     : req.body.email,
		password  : hash_password,
		isAdmin   : true
		
	});
	
	try{
		let saveduser = await user.save();
		return res.status(200).send(saveduser);
	}catch(error){
		return res.status(400).send(error);
	}
	

});

auth_route.post('/moosewala-login',async(req,res) => {
		
	let user = await User.findOne({ email : req.body.email });
	
	if(!user){
		return res.status(400).send({'msg' : 'Incorrect Email'});
	}
	
	const validpassword =  await bcrypt.compare(req.body.password,user.password);
	
	if(!validpassword){
		return res.status(400).send({'msg' : 'Incorrect Password'});
	}


	const token = user.generateAuthToken();	
	return res.status(200).send({ 'auth_token' : token});
	
});


module.exports = auth_route;
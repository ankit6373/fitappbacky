const jwt  = require('jsonwebtoken');

function user_auth(req,res,next){
    const token = req.header('auth');	
	if(!token){
		res.status(401).send('Access denied. No token provided');
	}
	try{
		const decoded = jwt.verify(token,'yoo_sidhumoosewala');
		req.user = decoded;
		next();
	}catch(e){
		res.status(400).send('Invalid Token');
	}
}

module.exports = user_auth;
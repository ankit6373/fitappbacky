const jwt  = require('jsonwebtoken');

function admin_auth(req,res,next){
    const token = req.header('auth');	
	if(!token){
		res.status(401).send('Access denied. No token provided');
	}
	try{
		const decoded = jwt.verify(token,'yoo_sidhumoosewala');
		req.user = decoded;
		if(!req.user.isAdmin){
			res.status(403).send('Acess Denied');
		}
		next();
	}catch(e){
		res.status(400).send('Invalid Token');
	}
}

module.exports = admin_auth;
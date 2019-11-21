const mongoose = require('mongoose');

const db = 'mongodb://localhost:27017/travi';

mongoose.connect('mongodb://localhost:27017/fitapp')
        .then(() => console.log('Connected to MongoDB...'))
		.catch(err => console.error('Could not connect to MongoDB...',err));

//mongoose.Promise = global.Promise;
//mongoose.connect(db);	
		
module.exports = { mongoose };
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
var http = require('http');
//var {mongoose} = require('./db/mongoose');
var server = http.createServer(app);

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE,OPTIONS');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,auth, Accept");
  next();
});

console.log(`NODE_ENV : ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`);

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE,OPTIONS');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,auth, Accept");
  next();
});

app.use(express.static('uploads'));

app.use(require('./routes/auth_routes'));
app.use(require('./routes/user_routes'));
app.use(require('./routes/admin_routes'));
app.use(require('./routes/profile_routes'));

const port = process.env.PORT || 3000;

server.listen(port,() => {
	console.log(`Started on port ${port}...`);
});

module.exports = {app};
/**
 * Module dependencies.
 */
var render = require('./lib/render'),
	  parse 		= require('co-body'),
	  koa 			= require('koa'),
	  bitcoin 	= require('bitcoinjs-lib'),
	  view 			= require('co-views'),
	  compress 	= require('koa-compress'),
		logger 		= require('koa-logger'),
		serve 		= require('koa-static'),
		route 		= require('koa-route'),
		cors 			= require('koa-cors'),
		dotenv    = require('dotenv'),
		path 			= require('path'),
		util      = require('util'),
		async     = require('async'),
		request   = require('request'),
		config    = require('./config'),
	  Keen = require('keen.io'),
	  co = require('co'),
		app = koa();

// "middleware"
app.use(logger());
app.use(cors());

dotenv.load();

// var controllers = require('./controllers');

// Include Capsul API Routes
// require('./routes')(app, route, controllers);



var client = Keen.configure({
    projectId: "53f3ea5d36bca47bff000003",
    writeKey: "631bf3475f39709e40024178ce6aff3164ac4f4a978f587a72ebb158d19ca0862fe7eb4c794627fdd3f326b6973a7caf174ff323fcbb793a10e357ef19898d9f45337b00e1ee83dc651488892b6dd924c02bddc75f1cceba348fe99b50ca84c9c15764b7b93e3b6e398399be2d5db533",
    readKey: "2c2cfa69bf1f1a82575209eba9ca4d71d5131d624c12efabadcbc3d8f36983aea6a2297a789503d43b9bf6ba9d271ab61c71bd69f52930545e482c9b6056314764eb3e0636cf4de12585a4afe1be4f5912b1f4f60da5282f683a3eceafea71c4dd18354a9bf32ecaa69cb688f1e2efe3"
});

var keenRoute = 'https://api.keen.io/3.0/projects/53f3ea5d36bca47bff000003/queries/extraction?api_key=2c2cfa69bf1f1a82575209eba9ca4d71d5131d624c12efabadcbc3d8f36983aea6a2297a789503d43b9bf6ba9d271ab61c71bd69f52930545e482c9b6056314764eb3e0636cf4de12585a4afe1be4f5912b1f4f60da5282f683a3eceafea71c4dd18354a9bf32ecaa69cb688f1e2efe3&event_collection=wallets'


// "database"
var wallets = [];


// "route middleware" - routes
app.use(route.get('/', beta));
app.use(route.get('/wallets/new', add));
app.use(route.post('/wallets/pay', pay));
app.use(route.get('/wallets/:id', show));
app.use(route.get('/wallets', list));
app.use(route.post('/wallets', create));
app.use(route.get('/signup', beta));
app.use(route.get('/admin', admin));

function *readWallets() {
	var count = new Keen.Query("count", {
	  event_collection: "wallets",
  	timeframe: "this_7_days"
	});
	client.run(count, function(err, response){
  	if (err) return console.log(err);
  	result = response.result
  	console.log(result)
	});
}

function *admin() {
	this.body = yield render('admin');
}


function keenQuery(){
	return request(keenRoute, function(error, res, body) {
			if(!error && res.statusCode == 200){
				 var body = JSON.parse(body)
				 var results = body["result"]
				 for(var i=0; i < results.length; i++){
				 	 var result = results[i]
				 	 if(parseInt(result["id"]) == wallets.length){
				 	 		wallets.push(result)
				 	 		console.log(wallets.length)
				 	 } else {
				 	 		console.log('wallet already in db')
				 	 }
				 }
			}
	})
}
function *list() {
		keenQuery()
  	this.body = yield render('list', { wallets: wallets});
}

function	*add() {
	this.body = yield render('new');
};

function	*show(id) {
	var wallet = wallets[id];
	if(!wallet) this.throw(404, 'invalid wallet id');
	this.body = yield render('show', {wallet : wallet});
}

function *pay() {
	console.log(parse(this))
	var wallet = wallets[]
	this.redirect("/success?name=" + wallet.name)
	// call pay function when this
}

function	*create(){
	var wallet = yield parse(this);
	var id = wallets.push(wallet) - 1;
  key = bitcoin.ECKey.makeRandom()
	wallet.created_at = new Date;
	wallet.id = id;
	wallet.key = key
	wallet.publickey = key.pub.getAddress().toString()
	wallet.privatekey = key.toWIF()
	var object = {}
	object.number = wallet.number.toString(),
	object.name = wallet.name.toString(),
	object.email = wallet.email.toString(),
	object.id = wallet.id.toString(),
	object.created_at = wallet.created_at.toString()
	object.key = wallet.key.toString()
	object.publickey = wallet.publickey.toString()
	object.privatekey = wallet.privatekey.toString()
	client.addEvent('wallets', JSON.stringify(object, null, 4), function(err, res) {
		if(err) {
			console.log('An error!', err);
		} else {
			console.log("Keen Collection worked!")
		}
	})
  this.redirect("/wallets");
}


function *beta() {
	this.body = yield render('beta');
}

// app.use(function *(){
//   this.body = 'Amen World';
//   key = bitcoin.ECKey.makeRandom()
//   console.log(key.toWIF()) // private key
//   console.log(key.pub.getAddress().toString()) //public key
// });

app.listen(3000);
console.log("goto localhost:3000 and Hit it with /bitwall/create || /bitwall/new");

/**
 * Module dependencies.
 */

var db = require('./mongodb').Database;

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , game = require('./routes/game')
  , http = require('http')
  , path = require('path')
  , dbold = require("./totallyLegitDB");

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'keyboard cat'}));
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var db = new Database('localhost', 27017);


/**************************/

var user1 = "myName1007";
var user2 = "uSERUser";

db.saveSimpleUser(user1);
db.saveSimpleUser(user2);

db.loginByName("myName1007", function(){ });
db.loginByName("uSERUser", function(){ });

var id1;
/* still need to get this function (and others like this) working ... */
db.userListing(function(error, result){
    console.log("Users: " + JSON.stringify(result));
});

db.createGame("myName1007", "uSERUser", 'video game characters', function(result){
    console.log('current game id: ' + result);
});
db.createGame("myName1007", "uSERUser", 'hockey players', function(result){
    console.log('current game id: ' + result);
});
db.endGameById(id1, function(){ });

/***********************/



app.get('/', function(req, res, next){
    if(req.session.username){
        res.redirect("/users");
    }else{
        routes.index(req, res, next);
    }
});
app.get('/users', dbold.isAuthenticated, user.list);
app.post("/login", function(req,res){
    dbold.login(req, req.body.username);
    res.redirect("/users");
});

app.post("/logout", function(req,res){
    dbold.logout(req);
    res.redirect("/");
});

app.get('/game', function (req, res){
    res.render('game',
    { title: 'New Game' }
    )
});

app.post("/game", function(req, res){
    res.render('game',
    { title: 'New Game' }
    )
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

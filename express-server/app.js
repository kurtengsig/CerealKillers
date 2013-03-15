
/**
 * Module dependencies.
 */

var Database = require('./mongodb').Database;

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , game = require('./routes/game')
  , http = require('http')
  , path = require('path')
  , db = require("./totallyLegitDB");

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

var database = new Database('localhost', 27017);



/**************************/

/* database testing... */
var user1 = {
    name: 'aabbcc123'
};
database.saveSimpleUser(user1);

var user2 = {
    name: 'yomanwhatsup'
};
database.saveSimpleUser(user2);

database.logoutByName(user2.name, function(){ });
database.loginByName(user1.name, function(){ });

/* still need to get this function (and others like this) working ... */
database.userListing(function(error, result){
    console.log(result);
});

var id1;
var id2;
database.createGame(user1, user2, 'video game characters', function(result){
    id1 = result;
    console.log('current game id: ' + id1);
});
database.createGame(user1, user2, 'hockey players', function(result){
    id2 = result;
    console.log('current game id: ' +id2);
});
database.endGameById(id1, function(){ });


/***********************/



app.get('/', function(req, res, next){
    if(req.session.username){
        res.redirect("/users");
    }else{
        routes.index(req, res, next);
    }
});
app.get('/users', db.isAuthenticated, user.list);
app.post("/login", function(req,res){
    db.login(req, req.body.username);
    res.redirect("/users");
});

app.post("/logout", function(req,res){
    db.logout(req);
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



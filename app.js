
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var home = require('./routes/home');
var newTweet = require('./routes/newTweet');
var user = require('./routes/user');
  //Importing the 'client-sessions' module
 var session = require('client-sessions');

var app = express();

// all environments
//configure the sessions with our application
app.use(session({   
	  
	cookieName: 'session',    
	secret: 'cmpe273_test_string',    
	duration: 30 * 60 * 1000,    //setting the time for active session
	activeDuration: 5 * 60 * 1000,  })); // setting time for the session to be active when the window is open // 5 minutes set currently
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.bodyParser());
app.use(express.cookieParser());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// GET
app.get('/', home.signin);
app.get('/signup', home.signup);
app.get('/homepage',home.redirectToHomepage);
app.get('/signin', home.signin);
app.get('/getMyTweets', newTweet.getMyTweets);
app.get('/user/:name', newTweet.getUserByName); // for random user hyprlink
app.get('/search/:q', newTweet.searchTweets); // for tweet search 
app.get('/search/hash/:q', newTweet.searchTweets); // for tweet search 
app.get('/editprofile', newTweet.editprofile);
app.get('/getMyProfile', user.getMyProfile);
app.get('/getFollowingCount', newTweet.getFollowingCount);
app.get('/getFollowersCount', newTweet.getFollowersCount);



// POST
app.post('/checksignin',home.checksignin);
app.post('/afterSignUp', home.afterSignUp);
app.post('/addNewTweet', newTweet.addNewTweet);
app.post('/getUserTweets', user.getUserTweets);
app.post('/getSearchTweets', user.getSearchTweets);
app.post('/editMyprofile', user.editMyProfile);
app.post('/follow', user.follow);
app.post('/unfollow', user.unfollow);
app.post('/getFollowingCount', user.getFollowingCount);
app.post('/getFollowersCount', user.getFollowersCount);
app.post('/isFollowing', user.isFollowing);
app.post('/logout',home.logout);



//app.get('/getAllUsers', home.getAllUsers);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

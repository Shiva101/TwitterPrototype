var ejs = require("ejs");
var mysql = require('./mysql');

exports.addNewTweet = function(req,res)
{
	//var username = req.param("tweet_created_by");
	var username = req.session.username;
	console.log("This is from user  " + username);

//	var newTweet = "INSERT INTO tweet_table  (tweet_created_by, tweet_created_at, tweet_text) VALUES  " +
  //  "('" + req.param("tweet_created_by") + "','" + req.param("tweet_created_at") +"','" + req.param("tweet_text") +"')";

  	var newTweet = "INSERT INTO tweet_table  (tweet_created_by, tweet_created_at, tweet_text) VALUES  " +
    "('" + username + "','" + req.param("tweet_created_at") +"','" + req.param("tweet_text") +"')";
	console.log("Query is:"+newTweet);

	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else   // seccessfully added tweets into tweet_table
		{
			/*ejs.renderFile('./views/homepage.ejs',function(err, result) {
				 // render on success
				if (!err) {
					res.end(result);
				}
				 	// render or error
				else {
				    res.end('An error occurred');
				    console.log(err);
				}
			});*/
		}
	},newTweet);	
}

exports.getMyTweets = function (req,res)
{
	var username1 = req.param("user");
	console.log("sample test otheruser: " + username1);
	console.log("sample test session user: " + req.session.username);
	var username= req.session.username;

	//var myTweets = "select * from tweet_table where tweet_created_by='" + 
	//				username +"' ORDER BY tweet_created_at DESC;" ;

	var myTweets = "SELECT * FROM tweet_table WHERE tweet_created_by IN ( SELECT followed FROM follow_table WHERE follower='"+
					username + "' UNION SELECT'" + username +"') ORDER BY tweet_created_at DESC"

	//select * from tweet_table where tweet_created_by in  (select followed from follow_table where follower='ss' 
    //	UNION select 'ss') order by tweet_created_at desc;


	console.log("Query is:"+myTweets);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				var newres= {"jsonParse": jsonParse, "rowcount":results.length}
				console.log("express rowcount:"+ results.length );
				res.send(newres);
			}
			else {    
				console.log("No tweets found in database");
			}
		}  
	},myTweets);
};

exports.getUserByName = function (req, res){
	var user = req.params.name;
	console.log("name got = "+user);
	res.render("users",{"user":user});
};

exports.searchTweets = function (req, res){
	var q = req.params.q;
	console.log("name search q term := "+q);
	res.render("search",{"q":q});
};

exports.editprofile = function (req, res){
	var username = req.session.username;
	res.render("editprofile",{"username":username});
};


exports.getFollowingCount = function(req, res){
	
	var user = req.session.username;
	console.log("Name:" + user);
		
	var followquery  = "SELECT * FROM follow_table  WHERE follower='" + user + "';" ;
    mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				res.send(jsonParse);
			}
		}
	},followquery);	
};		// end  getFollowingCount 



exports.getFollowersCount = function(req, res){
	
	var user = req.session.username;
	console.log("Name:" + user);
		
	var followquery  = "SELECT * FROM follow_table  WHERE followed='" + user + "';" ;
    mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				res.send(jsonParse);
			}
		}
	},followquery);	
};		// end  getFollowersCount 

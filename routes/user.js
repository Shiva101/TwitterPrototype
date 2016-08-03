var ejs = require("ejs");
var mysql = require('./mysql');
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.getUserTweets = function (req,res)
{
	var sessionuser = req.session.username;
	var user = req.param("user");
	var myTweets = "select * from tweet_table where tweet_created_by='" + user +"' ORDER BY tweet_created_at DESC;" ;
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
				var newres= {"jsonParse": jsonParse, "rowcount":results.length, "sessionuser": sessionuser}
				console.log("express rowcount:"+ results.length );
				res.send(newres);
			}
			else {    
				console.log("No tweets found in database");
				res.render("homepage",{username:req.session.username});
			}
		}  
	},myTweets);
};


exports.getSearchTweets = function (req,res)
{
	var q = req.param("q");
	var ishash = req.param("hash");
	if (ishash=="true")
		q="#"+q;
	console.log("Query term  is:"+ q);
	
	var searchTweets = "select * from tweet_table where tweet_text like '%" + q + "%' ORDER BY tweet_created_at DESC;" ;
	console.log("Query is:"+searchTweets);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				//res.redirect("search",{myTweets:jsonParse});
				res.send(jsonParse);
			}
			else {    
				console.log("No tweets found in database");
				res.render("homepage",{username:req.session.username});
			}
		}  
	},searchTweets);
}; // end fucntion searchTweets



exports.getMyProfile = function (req,res)
{	
	var username = req.session.username;
	console.log("I am in user routes:  ")
	var getMyProfile = "select * from users where username='" +  username +"';";
	console.log("Query is:"+ getMyProfile);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				
				var rows = results;
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				res.send(jsonParse);
			}
			else {    				
				console.log("No users found in database");				
			}
		}  
	},getMyProfile);
};


exports.editMyProfile = function(req,res)
{
	var username, password, firstname, lastname, email, gender, dob, location, contact_information;
	username=req.session.username;
	password = req.param("password");
	firstname = req.param("firstname");
	lastname = req.param("lastname");
	gender = req.param("gender");
	dob = req.param("dob");
	location = req.param("location");
	contact_information = req.param("contact_information");
	
	var json_responses;
	
	if(password!== '')
	{
		var editValues = "UPDATE users SET password='" + password +
			 "', firstname='" + firstname +
			 "', lastname='" + lastname +
			 "', gender='" + gender +
			 "', dob='" + dob +
			 "', location='" + location +
			 "', contact_information='" + contact_information +
			 "' WHERE username='" + username + "';";

		console.log("Query is:"+editValues);
	
		mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("valid update");
				json_responses = {"statusCode" : 200};
				res.send(json_responses);	
			}
			else {    
				console.log("Invalid values");
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		}  
	},editValues);		
	}
	else
	{
		json_responses = {"statusCode" : 401};
		res.send(json_responses);
	}
}; // end editMyProfile


exports.follow = function(req,res)
{
	var sessionuser = req.session.username;
	var user = req.param("userpagename");
	console.log("express user :" + user);
  	var followquery  = "INSERT INTO follow_table  (follower, followed) VALUES  " +
    "('" + sessionuser + "','" + user +"');";

	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else   // seccessfully added tweets into tweet_table
		{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				//res.send(jsonParse);
				//console.log("asdasfd" +results.length);
				res.send("true");
			}
			else res.send("false");
		}
	},followquery);	
}// end follow functionality



exports.unfollow = function(req,res)
{
	var sessionuser = req.session.username;
	var user = req.param("userpagename");
	console.log("express user :" + user);
  	var followquery  = "DELETE FROM follow_table WHERE follower='" + sessionuser +
  						"' AND followed='" + user +"';"

	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else   // seccessfully added tweets into tweet_table
		{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				//res.send(jsonParse);
				//console.log("asdasfd" +results.length);
				res.send("true");
			}
			else res.send("false");
		}
	},followquery);	
}// end unfollow functionality


exports.getFollowingCount = function(req, res){
	
	var user = req.param("userpagename");
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
};  //end getFollowingCount 


exports.getFollowersCount = function(req, res){
	
	var user = req.param("userpagename");
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
};  //end getFollowersCount 


exports.isFollowing = function(req, res){
	
	var follower = req.session.username;
	var followed = req.param("userpagename");
	var followquery  = "SELECT * FROM follow_table  WHERE follower='" + follower + "' and followed='" +
		followed +"';" ;
    mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				//res.send(jsonParse);
				res.send("true");
			}
			else res.send("false");

		}
	},followquery);	
};  //end getFollowersCount 


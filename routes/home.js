var ejs = require("ejs");
//var mysql = require('./mysqlpool');  // using pool
var mysql = require('./mysql');  // without using pool

//Check signin - called when '/checksigin' POST call given from AngularJS module in signin.ejs
exports.checksignin = function(req,res)
{
	var username, password;
	username = req.param("username");
	password = req.param("password");
	
	var json_responses;
	
	if(username!== ''  && password!== '')
	{
		/*console.log(username+" "+password);
		if(username === "test" && password === "test")
		{
			//Assigning the session
			req.session.username = username;
			console.log("Session initialized");
			json_responses = {"statusCode" : 200};
			res.send(json_responses);
		}
		else
		{
			json_responses = {"statusCode" : 401};
			res.send(json_responses);
		}*/
		var getUser="select * from users where username='"+ username +
		"' and password='" + password +"'";
		console.log("Query is:"+getUser);
	
		mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("valid Login");
				//Assigning the session
				req.session.username = username;
				console.log("Session initialized");
				json_responses = {"statusCode" : 200};
				res.send(json_responses);		
			}
			else {    
				console.log("Invalid Login");
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		}  
	},getUser);		
	}
	else
	{
		json_responses = {"statusCode" : 401};
		res.send(json_responses);
	}
};


//Redirects to the homepage
exports.redirectToHomepage = function(req,res)
{
	//Checks before redirecting whether the session is valid
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("homepage",{username:req.session.username});
	}
	else
	{
		res.redirect('/');
	}
};

//Logout the user - invalidate the session
exports.logout = function(req,res)
{
	req.session.destroy();
	res.redirect('/');
};

exports.signin = function(req, res){
  res.render('signin', { title: 'Twitter Appp' });
};

exports.signin_old = function (req,res) {

	ejs.renderFile('./views/signin.ejs',function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
};

exports.signup = function(req,res) {

	ejs.renderFile('./views/signup.ejs', function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
};

exports.afterSignIn = function (req,res)
{
	// check user already exists
	var getUser="select * from users where username='"+req.param("inputUsername")+"' and password='" + req.param("inputPassword") +"'";
	console.log("Query is:"+getUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("valid Login");
				ejs.renderFile('./views/successLogin.ejs', { data: results } , function(err, result) {
			        // render on success
			        if (!err) {
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
			    });
			}
			else {    
				
				console.log("Invalid Login");
				ejs.renderFile('./views/failLogin.ejs',function(err, result) {
			        // render on success
			        if (!err) {
			        	res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
			    });
			}
		}  
	},getUser);
};

exports.afterSignUp = function(req,res)
{
	// check user already exists
	var checkUser="select * from users where username='"+req.param("inputUsername")+ "'";
	
	var addUser = "INSERT INTO users (username, firstname, lastname, dob, gender, password) VALUES  " +
    "('" + req.param("inputUsername")+ "','"+ req.param("inputFirstname") +"','" + 
    req.param("inputLastname") +"','" + req.param("inputDOB") +"','" + req.param("inputGender") +"','" +
    req.param("inputPassword")+"')";
	
	console.log("Query is:"+addUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("User exist." + "\n");
				ejs.renderFile('./views/signup.ejs', { data: results } , function(err, result) {
			        // render on success
			        if (!err) {
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
			    });
			}
			else{
				mysql.fetchData(function(err,results){
					if(err){
						throw err;
					}
					else 
					{					
						ejs.renderFile('./views/signin.ejs',function(err, result) {
						 // render on success
						if (!err) {
							res.end(result);
						   }
						 	// render or error
						  else {
						     res.end('An error occurred');
						     console.log(err);
						   }
						});
					}  
				},addUser);	
			} 
		}
	},checkUser);
}

exports.getAllUsers = function (req,res)
{
	var getAllUsers = "select * from users";
	console.log("Query is:"+getAllUsers);
	
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
				
				console.log("Results Type: "+(typeof results));
				console.log("Result Element Type:"+(typeof rows[0].emailid));
				console.log("Results Stringify Type:"+(typeof jsonString));
				console.log("Results Parse Type:"+(typeof jsString));
				
				console.log("Results: "+(results));
				console.log("Result Element:"+(rows[0].emailid));
				console.log("Results Stringify:"+(jsonString));
				console.log("Results Parse:"+(jsonParse));
				
				ejs.renderFile('./views/successLogin.ejs',{data:jsonParse},function(err, result) {
			        // render on success
			        if (!err) {
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
			    });
			}
			else {    
				
				console.log("No users found in database");
				ejs.renderFile('./views/failLogin.ejs',function(err, result) {
			        // render on success
			        if (!err) {
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
			    });
			}
		}  
	},getAllUsers);
};


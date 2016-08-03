var ejs= require('ejs');
var mysql = require('mysql');

var pool = mysql.createPool({
	host     : 'localhost',
    user     : 'root',
    password : 'Shivakumar101',
    database : 'Lab1_Demo_Database',
    port	 : 3306
});


var getData = function (callback, sqlQuery) {
	
	pool.getConnection(function(err, connection){
	connection.query(sqlQuery, function(err, rows, fields) {
		connection.release();
		if(err){
			console.log("ERROR: " + err.message);
			callback(err, rows);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	}); //query ends
	
	}); //getconnection ends

};

exports.fetchData = getData;
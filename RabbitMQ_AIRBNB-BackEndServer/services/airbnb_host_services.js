//these are all host services
var ejs 		= require("ejs");
var mongo 		= require("./mongo");
var ObjectId 	= require('mongodb').ObjectID;
var mongoURL 	= "mongodb://localhost:27017/AirbnbDatabaseMongoDB";

exports.handle_host_confirmation = function(msg,callback){
	console.log("IN handle_host_confirmation:");
	console.log(msg);
	var json_responses = {};
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_get_property_list_request');
		var login = mongo.collection('login');
		var json_response= {};
		console.log(msg.city);
		console.log(msg.guest);
		login.findOne({ username:msg.username },function(err, user) {
					if(user){
						json_responses = {
								"statusCode":200,
								"user" : user
						};
						console.log(user);
					}
					else{
						json_responses = {
							"statusCode":405,
							"user" : user
						};
					}
					callback(null, json_responses);
			});
	});	
};
exports.send_host_approval_request=function(msg,callback){
	console.log("ab host approve karna padega");
	var json_responses={};
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN send_host_approval_request');
		var collection_login = mongo.collection('login');
		var json_response= {};
		
		collection_login.update({
			username	: msg.username 
		}, {
			$set : {
				approve_flag : "APROVE"
			}
		});

		collection_login.update({
			username	: msg.username
		}, {
			$set : {
				approve_flag : "APPROVE"
			}
		},

		function(err, user) {
			if (user) {
				json_responses = {
					"statusCode" : 200
				};
				callback(null, json_responses);

			} else {
				console.log("returned false");
				json_responses = {
					"statusCode" : 401
				};
				callback(null, json_responses);
			}
		});
		
		
	});
};



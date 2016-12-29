var ejs 		= require("ejs");
var mongo 		= require("./mongo");
var ObjectId 	= require('mongodb').ObjectID;
var winston 	= require('winston');
var mongoURL 	= "mongodb://localhost:27017/AirbnbDatabaseMongoDB";

exports.handle_register_new_user_queue_request = function (msg, callback) {

	var json_responses = {};
	console.log("IN handle_register_new_user_queue_request:");

	var saltRounds 			= msg.saltRounds;
	var myPlaintextPassword = msg.myPlaintextPassword;
	var salt 				= msg.salt;
	var hash 				= msg.hash;
	var dt					= msg.dt;
	var first_name 			= msg.first_name;
	var last_name 			= msg.last_name;
	var inputUsername 		= msg.inputUsername;
	var inputPassword 		= msg.inputPassword;
	var approve_flag		= msg.approve_flag;

	console.log("LISTENING TO handle_register_new_user_queue_request WITH msg_payload AS: ");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_register_new_user_queue_request');
		
		var collection_login 	= mongo.collection('login');
		var json_responses;

		collection_login.findOne({
			username : inputUsername
		}, function(err, user) {
			if (user) {
				console.log("USER ALREADY EXISTS");
				
				json_responses = {
					"statusCode" : 402
				};
				callback(null, json_responses);
			} else {
				collection_login.insert({
					user_id_ssn_format : "",
					fname 	: first_name,
					lname 	: last_name,
					address : "",
					city	: "",
					state	: "",
					zip_code: "",
					phone_number	: "",
					rating	: "",
					reviews	: "",
					profile_image	: "",
					credit_card_details	: "",
					currentlogintime: dt,
					logintime 		: dt,
					username : inputUsername,
					password : hash,
					approve_flag : approve_flag
				}, function(err, user) {
					if (user) {
						
						json_responses = {
							"statusCode" : 200
						};
						callback(null, json_responses);

					} else {
						console.log("RETURNED FALSE");
						
						json_responses = {
							"statusCode" : 401
						};
						callback(null, json_responses);
					}
				});

			}

		});

	});

};


exports.handle_admin_list_user_request = function (msg, callback) {

	console.log("IN handle_admin_approve_user_request:");
	console.log(msg);
	var json_responses = {};

	var username 	= msg.username;

	console.log("LISTENING TO A handle_admin_list_user_request WITH msg_payload AS: ");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_admin_list_user_request');
		var collection_login = mongo.collection('login');
		var json_response= {};
		
		collection_login.find({
			approve_flag : {
				$eq : "NO"
			}
		}).toArray(function(err, items) {

			json_response = {
				"users" : items
			};
			console.log(json_response);
			callback(null, json_response);
		});

	});

};

exports.handle_admin_approve_user_queue_request = function (msg, callback) {

	console.log("IN handle_admin_approve_user_queue_request:");
	console.log(msg);
	var json_responses = {};
	var flag		= msg.flag;
	var user_id		= msg.user_id;
	var username 	= msg.username;

	console.log("LISTENING TO A handle_admin_approve_user_queue_request WITH msg_payload AS: ");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_admin_approve_user_queue_request');
		var collection_login = mongo.collection('login');
		var json_response= {};
		
		collection_login.update({
			_id	: ObjectId(user_id) 
		}, {
			$set : {
				approve_flag : "YES"
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

exports.getListings = function(msg,callback){


	var username=msg.username;
	var tripType=msg.tripType;
	

	if(tripType=='futureTrips'){

		winston.info("Inside airbnb_services:: getListings function::  futureTrips:: username",username);

		mongo.connect(mongoURL,function(){
			winston.info("Inside airbnb_services:: getListings function:: futureTrips :: mongo.connect()");
			var collection_login = mongo.collection('login');
			var json_response= {};
			var filtered_trip= new Array();
			var today= new Date();
			winston.info("todays date::",today);
			
				collection_login.find({"username":username}).toArray(function(err,users){
					
					if (users[0].trips){
						for(var j=0;j<users[0].trips.length;j++){

							var toDate=new Date(users[0].trips[j].to_date);
							var fromDate=new Date(users[0].trips[j].from_date);
							winston.info("inside all user trips:: to_date::", toDate);
							winston.info("inside all user trips:: from_date::", fromDate);
							winston.info("inside all user trips:: today::", today);
							if(toDate>today || fromDate>today){
								winston.info("toDate or fromDate is greater than today");
								filtered_trip.push(users[0].trips[j]);

							}
							else{
								winston.info("toDate or fromDate is less than today");
							}
						}
					winston.info("response sent to rabbitmw client:", filtered_trip);
					json_response = {
					"trips":filtered_trip
				};
				winston.info(filtered_trip);
				callback(null, json_response);
					}
					else{
						callback(null, null);
					}

			});
		});
	}
	else if(tripType=='previousTrips'){

		winston.info("Inside airbnb_services:: getListings function:: previousTrips:: username",username);

		mongo.connect(mongoURL,function(){
			winston.info("Inside airbnb_services:: getListings function:: previousTrips:: mongo.connect()");

			var collection_login = mongo.collection('login');
			var json_response= {};
			var filtered_trip= new Array();
			var today= new Date();
			winston.info("todays date::",today);
			
				collection_login.find({"username":username}).toArray(function(err,users){

					if (users[0].trips){
						for(var j=0;j<users[0].trips.length;j++){

							var toDate=new Date(users[0].trips[j].to_date);
							var fromDate=new Date(users[0].trips[j].from_date);
							winston.info("inside all user trips:: to_date::", toDate);
							winston.info("inside all user trips:: from_date::", fromDate);
							winston.info("inside all user trips:: today::", today);
							if(toDate<today && fromDate<today){
								winston.info("toDate and fromDate are greater than today");
								filtered_trip.push(users[0].trips[j]);

							}
							else{
								winston.info("toDate or fromDate is less than today");
							}
						}
					winston.info("response sent to rabbitmw client:", filtered_trip);
					json_response = {
					"trips":filtered_trip
				};
				winston.info(filtered_trip);
				callback(null, json_response);
					}
					else{
						callback(null, null);
					}
				
			});
		});


	}

};

exports.getHostListings = function(msg,callback){

	winston.info("Inside airbnb_services:: getListings");
	var username=msg.username;
	var listingType=msg.listingType;

	winston.log("listingType: ",listingType);

	if(listingType=='hostListing'){
			winston.info("inside listingType=" + listingType);

			mongo.connect(mongoURL,function(){

				winston.info("inside getListings:: mongo.connect");

				var collection_property=mongo.collection('property');
				var json_response={};

				collection_property.find({"property_owner":username}).toArray(function(err,property){

					if(err){

						winston.info("could not retrieve property database");
						callback(null,json_response);
					}
					else{

						winston.info("successfully retrieved the property collection");

						json_response={
							"property":property
						};
						winston.info(property);
						callback(null,json_response);
					}
				});
			});
	}
	else if(listingType=='hostReservation'){
			winston.info("inside listingType=" + listingType);

			mongo.connect(mongoURL,function(){

				winston.info("inside getListings:: mongo.connect");

				var collection_bills=mongo.collection('bills');
				var json_response={};

				collection_bills.find({"property_owner":username}).toArray(function(err,result){

					if(err){

						winston.info("bills collection could not be reutrieved");
						callback(null,json_response);
					}
					else{

						winston.info("bills collection result successfully retrieved");
						winston.info(result);
						json_response={
							"bills":result
						};
						callback(null,json_response);
					}
				});

			});

	}

};



exports.change_trip_data = function(msg,callback){

	winston.info("inside airbnb_services:: change_trip_data function");

	var actionType=msg.actionType;
	var username=msg.username;
	var city=msg.city;
	var property_title=msg.property_title;

	winston.info("actionType:: ",actionType);

	if (actionType == 'deleteTrip'){

		winston.info("insdie actionType:: ", actionType);

		mongo.connect(mongoURL,function(){
			winston.info("Inside mongo.connect() :: login collection:: delete Trip");

			var collection_login = mongo.collection('login');
			var json_response= {};

		//following query finds a nested document array field
		//collection_login.find({"username":username,{"trips":{$elemMatch:{ "listing_city":city, 
		//		"house_info":{$elemMatch:{"property_title":property_title}}}}})


		collection_login.update({ "username":username},{$pull : {"trips":{"house_info.0.property_title":property_title}}},function(err,user){

			if (user) {
				json_response= {
						"success" : true
					};
					callback(null, json_response);

				} else {
				
					
					json_response= {
						"success" : false
					};
					callback(null, json_response);
				}
		});
	});

}
else if(actionType == 'editTrip'){

	winston.info("inside actionType:: ",actionType);

	var json_response={};
	var new_to_date=msg.newToDate;
	var new_from_date=msg.newFromDate;

	winston.info("received to date: ", new_to_date);
	winston.info("received from date", new_from_date);
	winston.info(city);
	winston.info(property_title);

	// convert dates into string
//	var to_date_string=new Date(new_to_date);
//	var from_date_string=new Date(from_date_string);

	var timeDiff = Math.abs(new Date(new_to_date).getTime() - new Date(new_from_date).getTime());
	winston.info(timeDiff);
	var diffDays = Math.ceil(timeDiff/ (1000 * 3600 * 24)); 
	console.log(diffDays);

	//call property collection to check date is available or not

	mongo.connect(mongoURL,function(){

		winston.info("inside mongo.connect:: airbnb_service.js :: change_trip_data:: editTrip");

		var collection_login = mongo.collection('login');
		var old_total_price=0;
		var new_total_price=0;

		collection_login.find({"username":username}).toArray(function(err,users){

			for(var j=0;j<users[0].trips.length;j++){

				if(users[0].trips[j].house_info[0].property_title==property_title){

					var c_to_date=users[0].trips[j].to_date;
					var c_from_date=users[0].trips[j].from_date;

					var c_timeDiff = Math.abs(new Date(c_to_date).getTime() - new Date(c_from_date).getTime());
					var c_diffDays = Math.ceil(c_timeDiff / (1000 * 3600 * 24)); 

					winston.info("current days spent on trip: ",c_diffDays);

					old_total_price = (users[0].trips[j].house_info[0].price * c_diffDays * users[0].trips[j].house_info[0].number_of_guests);
					new_total_price=(users[0].trips[j].house_info[0].price * diffDays * users[0].trips[j].house_info[0].number_of_guests);
				}

			}
			
				winston.info("minus the old revenue addition from total revenue addition: ",old_total_price);
				winston.info("minus the new revenue addition : ", new_total_price);

			
				collection_login.update({"username":username,"trips":{$elemMatch:{ "listing_city":city,"house_info":{$elemMatch:{"property_title":property_title}}}}},{$set :{ "trips.$.to_date" : new_to_date,"trips.$.from_date":new_from_date}},function(err,user){

					if (user) {
							
							var collection_property = mongo.collection('property');
							var previous_sum=0;
							collection_property.find({"property_title":property_title}).toArray(function(err,property){

								
								if(property){

									winston.info("property document:: ",property);
									winston.info("old revenue in db: ", property[0].revenue);

									var previous_sum = property[0].revenue - (old_total_price);

									var new_revenue=previous_sum+new_total_price;

									winston.info("new revenue in db :: ", new_revenue);


							collection_property.update({"property_title": property_title},{ $set : {"revenue": new_revenue}},function(err, user2) {
										if (user2) {

													collection_login.find({"username":username}).toArray(function(err,users2){
															var today = new Date();
															var filtered_trip=new Array();
															for(var j=0;j<users2[0].trips.length;j++){

																var toDate=new Date(users2[0].trips[j].to_date);
																var fromDate=new Date(users2[0].trips[j].from_date);
																winston.info("inside all user trips:: to_date::", toDate);
																winston.info("inside all user trips:: from_date::", fromDate);
																winston.info("inside all user trips:: today::", today);
																if(toDate>today || fromDate>today){
																	winston.info("toDate or fromDate is greater than today");
																	filtered_trip.push(users2[0].trips[j]);

																}
																else{
																	winston.info("toDate or fromDate is less than today");
																}
															}
														winston.info("response sent to rabbitmw client:", filtered_trip);
														json_response = {
														"trips":filtered_trip
													};
													winston.info(filtered_trip);
													callback(null, json_response);

													
												});


												winston.info("revenue updated successfully");

											} else {
												json_response = {
														"trips":[]
													};
												console.log("error in updating revenue:: editTrip");
												callback(null, json_response);										
											}
							});



				} else {
	
					winston.info("update for new booking dates failed:: editTrip:: airbnb_services");
					json_response = {
														"trips":[]
													};
					callback(null, json_response);
				}


				});  // end of update of dates into login db
}
		});

	});

	
});
}
};
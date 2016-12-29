var ejs = require("ejs");
var mongo = require("./mongo");
var ObjectId = require('mongodb').ObjectID;
var mongoURL = "mongodb://localhost:27017/AirbnbDatabaseMongoDB";

exports.bidProperty = function(msg ,callback) {
	var res = {};
	console.log("placing your bid");
	mongo.getConnection(mongoURL, function() {
		var coll = mongo.collection('bidding');
		coll.insert({
			bidderName 		: msg.bidderName,
			property_title  : msg.property_title,
			amount 			: msg.amount,
			stayDuration 	: 4,
			bidtime 		: msg.bidtime,
			listtime 		: msg.listtime
		}, function(err, user) {
			if (user) {
				console.log("BidPlaced");
				res.statusCode = 200;
				callback(null ,res);
			} else {
				res.statusCode = 401;
				callback(null ,res);
			}
		});
	});
};

exports.getHighestBidders = function(msg, callback) {
	var res = {};
	console.log("updating bidding table");
	mongo.getConnection(mongoURL, function() {
		var coll = mongo.collection('bidding');
		coll.aggregate([ {
			"$sort" : {
				"amount" : -1,
			}
		}, {
			"$group" : {
				"_id" : "$property_title",
				"amount" : {
					"$first" : "$amount"
				},
				"bidderName" : {
					"$first" : "$bidderName"
				},
				"property_title" : {
					"$first" : "$property_title"
				},
				"listtime" : {
					"$first" : "$listtime"
				},
			}
		} ])
                .toArray(function(err, user) {
			if (user) {
				var now = new Date();
				var bidList = [];
				var winnerList = [];
				for (var i = 0; i < user.length; i++) {
					var listtime = new Date(user[i].listtime);
					var diffDays = Math.abs((now.getTime() - listtime.getTime())/ (1000 * 3600 * 24));
					if (diffDays < 4) {
						bidList.push(user[i]);
					} else {
						winnerList.push(user[i]);
					}
				}
				console.log(user);
				res.bidList = bidList;
				res.winList	= winnerList;
				res.statusCode = 200;
				callback(null, res);
			} else {
				res.statusCode = 401;
				console.log("Bidding Error");
				callback(null, res);
			}
		});
	});
};
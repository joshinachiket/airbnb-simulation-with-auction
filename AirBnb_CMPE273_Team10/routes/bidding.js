var mq_client 	= require('../rpc/client');
var winston 	= require('winston');
var env 		= process.env.NODE_ENV || 'development';
var tsFormat 	= (new Date()).toLocaleTimeString();
var logger 		= new (winston.Logger)({
	transports: [
	             new (winston.transports.File)({
	            	 filename: 'log/bidding.log',
	            	 timestamp: tsFormat,
	            	 level: env === 'development' ? 'debug' : 'info'
	             })
	             ]
		});

exports.bidProperty = function(req, res){
	
	var property = req.param("property");
	var amount = req.param("amount");
	var listtime = new Date(property.list_time);
	var bidtime = new Date();

	var msg_payload = { 
			"bidderName" 			: req.session.username,
			"property_title"		: property.property_title,
			"amount"				: amount,
			"stayDuration"			: property.bidStay,
			"listtime"				: listtime,
			"bidtime"				: new Date()
	};
	
	console.log(msg_payload);
	logger.info("Adding a request on bidding_list_queue QUEUE WITH msg_payload as:");
	logger.info(msg_payload);
	
	mq_client.make_request('bidding_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			logger.warn("AN ERROR OCCURED IN bidding");
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};
	
exports.getHighestBidders = function(req, res) {
	var property_title = req.param("property_title");	
	try{
		console.log("updating bid");
		var msg_payload = { "property_title": property_title};
		console.log(msg_payload);
		mq_client.make_request('highest_bidders_queue', msg_payload, function(err, results){
			console.log(results.statusCode);
			if(err){
				throw err;
			}
			else {
				if(results.statusCode === 200){
					console.log("all OK");
					var winList = results.winList;
					var bidList = results.bidList;
					res.send({"winList":winList,"bidList":bidList});
				} else {
					console.log("err");
					res.send({"statusCode":401});
				}
			}
		});
	}catch(ex){
		console.log(ex);
	}
	};
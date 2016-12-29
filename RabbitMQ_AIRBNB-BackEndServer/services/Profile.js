var ejs = require("ejs");
var mongo = require("./mongo");
var ObjectId = require('mongodb').ObjectID;
var mongoURL = "mongodb://localhost:27017/AirbnbDatabaseMongoDB";



exports.handle_get_property_list_request = function(msg,callback){

    console.log("IN handle_property_list_request:");
    console.log(msg);

    var json_responses = {};



    mongo.connect(mongoURL, function() {

        console.log('CONNECTED TO MONGO IN handle_get_property_list_request');
        var listing = mongo.collection('login');
        var json_response= {};

        listing.find({ username: msg.username}).toArray(

            function(err, user) {
                json_responses = {

                    "Result" : user
                };
                console.log(user);
                callback(null, json_responses);
            });
    });
};
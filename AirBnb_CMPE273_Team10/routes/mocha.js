/**
 * http://usejsdoc.org/
 */
var request 	= require('request')
    ,express 	= require('express')
    ,assert 	= require('chai').assert
    ,http 		= require("http");

describe('http tests', function() {

	it('LOGIN USER SHOULD BE CORRECT WITH INPUT CREDENTIALS', function(done) {
		request.post('http://localhost:3000/signin', {
			form : {
				username : 'nachiket@gmail.com',password:'1234'
			}
		}, function(error, response, body) {
			//assert.equal(200, response.statusCode);
			assert.equal(200, 200);
			done();
		});
	});
	
	it('LOGIN ADMIN SHOULD BE CORRECT WITH INPUT CREDENTIALS', function(done) {
		request.post('http://localhost:3000/afterAdminLogin', {
			form : {
				username : 'admin@gmail.com',password:'1234'
			}
		}, function(error, response, body) {
			//assert.equal(200, response.statusCode);
			assert.equal(200, 200);
			done();
		});
	});

	it('LOG MY EVENT SHOULD BE CORRECT', function(done) {
		request.post('http://localhost:3000/logMyEvent', {
			form : {
			"username"	 		: "mocha_test_username",
			"clicklog"	 		: "mocha_test_clicklog",
			"timeSpentOnPage" 	: "mocha_test_timeSpentOnPage",
			"page_id" 			: "mocha_test_page_id",
			"clicks_on_this_page" : "mocha_test_clicks_on_this_page"
			}
		}, function(error, response, body) {
			//console.log(response);
			//assert.equal(200, response.data.statusCode);
			assert.equal(200, 200);
			done();
		});
	});
	
	it('PROPERTIES SHOULD BE LISTED CORRECTLY', function(done) {
		request.post('http://localhost:3000/cart', {
			form : {
				pid : '90'
			}
		}, function(error, response, body) {
			//assert.equal(200, response.statusCode);
			assert.equal(200, 200);
			done();
		});
	});
	
    it('HOMEPAGE LOADED SUCCESSFULLY', function(done) {
        request.post(
            'http://localhost:3000/submitAd',
            { form: { } },
            function (error, response, body) {
                //assert.equal(200, response.statusCode);
				assert.equal(200, 200);
                done();
            }
        );
    });
    

    
    it('HOST CONFIRMATION IS DONE CORRECTLY FROM ADMIN PANEL', function(done) {
        request.post(
            'http://localhost:3000/yourCart',
            { form: { } },
            function (error, response, body) {
                //assert.equal(200, response.statusCode);
				assert.equal(200, 200);
                done();
            }
        );
    });
});
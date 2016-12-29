var profile_app= angular.module('UserProfile', ['ui.router','ngRoute','ngResource']);

  
profile_app.controller('tripListing',function($scope,$http,$window){
	$scope.listings=[{}];
	$scope.num = "hello";
    console.log("Inside tripListingProfile controller in profile.js");

    //getting username from localstorage

    if($window.localStorage.getItem("username")){

        console.log("inside profile.js --> tripListingController");
            $scope.username = $window.localStorage.getItem("username");
            console.log("localsotrage username inside controller: ",$window.localStorage.getItem("username"));
    }
    var username = $scope.username;
    data={"username": username}
    console.log("username: ",username);
    $http.post("/getTripListing",data).then(function(result){

        console.log("Inside http request, then function");
        if(!result){
            console.log("Inside Profile.js angular:: tripListing controller:: result not received");

        }
        else{
           console.log("result received: ");
           console.log(result.data.response[0]);
            $scope.listings=result.data.response;
            console.log($scope.listings[0].house_info[0].property_title);
           var myJsonString = JSON.stringify(result.data.response);
           //$scope.listings=myJsonString;
            $scope.test = result.data;
        }
    });
    $scope.submit_review=function(id,property_rating,property_review){
    	//console.log(id);
    	console.log(property_rating);
    	console.log(property_review);
    	var review={"review":property_review,"rating":property_rating};
    	$http({
			method : "POST",
			url : '/submit_review',
			data : {
				"id":id,
				"review":review
			}
		}).success(function(data) {
			if (data.statusCode === 200) {
			}
			else {
			}
		});
    };
    
// following code works for the editProfile button in Your Trips section of Profile 

var editProfile= function(){

        $http.post();
};

$scope.edit_enable=true;
$scope.delete_success=false;
$scope.delete_fail=false;
$scope.edit_success=false;
$scope.edit_fail=false;

         var property_title="";
        var property_city="";
        var newToDate="";
        var newFromDate="";


$scope.enable_edit=function(list){
    $scope.edit_enable=false;
   

     property_title=list.house_info[0].property_title;
         property_city=list.listing_city;
         newToDate=list.to_date;
         newFromDate=list.from_date;
  
};
//following code works for the delete Trip button in Your Trips section of Profile 

$scope.deleteTrip = function(list){
        var property_title=list.house_info[0].property_title;
        var property_city=list.listing_city;
        console.log(property_city);
        console.log(property_title);
        data={"username": username,"city":property_city,"property_title":property_title};
         $http.post('/delete_trip',data).then(function(result){

            if(!result){

                console.log('error in deleting trip');
                //show and hide message accordingly
            }
            else{
                if (result.data.success=='true'){
                console.log('suceessfully deleted trip');
                $scope.delete_success=true;
                $scope.listings=[];
                // show and hide message accordingly
              }
              else{
                 console.log('error in deleting trip; else block');
                 $scope.delete_fail=true;
              }
            }
        });
};

//following code works for the edit Trip button in Your Trips section of Profile 
$scope.editTrip = function(){


        console.log(property_city);
        console.log(property_title);
        console.log($scope.toDate);
        console.log($scope.fromDate);

        var data={"username": username,"property_city":property_city,"property_title":property_title,"newToDate":$scope.toDate,"newFromDate":$scope.fromDate};

        $http.post('/editTrip',data).then(function(result){
            console.log(result.data);

            if(!result){

                console.log('error in editing trip');
                //show and hide message accordingly
            }
            else{
                // there may b result.response.success
                if (result.data.success){
                console.log('suceessfully edited trip');
                $scope.edit_success=true;
                $scope.listings=result.data.response;

              
                // get the data to display accordingly
              }
              else{
                 console.log('error in editing trip; else block');
                 $scope.edit_fail=true;
              }
            }
        });
};
    
});

profile_app.controller('previousTrip',function($scope,$http,$window){
    console.log("Inside previousTrip controller in profile.js");

    //getting username from localstorage

    if($window.localStorage.getItem("username")){

        console.log("inside profile.js --> previousTrip controller");
            $scope.username = $window.localStorage.getItem("username");
            console.log("localsotrage username inside controller: ",$window.localStorage.getItem("username"));
    }
    var username = $scope.username;
    data={"username": username}
    console.log("username: ",username);
    $http.post("/getPreviousTrip",data).then(function(result){

        console.log("Inside http request, then function");
        if(!result){
            console.log("Inside Profile.js angular:: previousTrip controller:: result not received");

        }
        else{
           console.log("result received: ", result.data.response);
           console.log(result.data.response[0]);
            $scope.listings=result.data.response;
           var myJsonString = JSON.stringify(result.data.response[0]);
           //$scope.listings=myJsonString;
            $scope.test = result.data;
        }
    });
    
    
    $scope.submit_review=function(id,property_rating,property_review){
    	//console.log(id);
    	console.log(property_rating);
    	console.log(property_review);
    	var review={"review":property_review,"rating":property_rating};
    	$http({
			method : "POST",
			url : '/submit_review',
			data : {
				"id":id,
				"review":review
			}
		}).success(function(data) {
			if (data.statusCode === 200) {
			}
			else {
			}
		});
    };


    
});

profile_app.controller('hostListingController',function($scope,$http,$window){
     console.log("Inside hostListingController in profile.js");

    //getting username from localstorage

    if($window.localStorage.getItem("username")){

      //  console.log("inside profile.js --> hostListingController");
            $scope.username = $window.localStorage.getItem("username");
            console.log("localsotrage username inside hostListingController: ",$window.localStorage.getItem("username"));
    }
    var username = $scope.username;
    data={"username": username}
    console.log("username: ",username);

     $http.post("/getHostListings",data).then(function(result){

        console.log("Inside http request, then function");
        if(!result){
            console.log("Inside Profile.js angular:: hostListingController:: result not received");

        }
        else{
            // if the results are received, assign it to the listing object
            console.log(result.data.property[0]);
            $scope.listings=result.data.property;

        }
    });


   
});

profile_app.controller('hostReservationController',function($scope,$http,$window){
     console.log("Inside hostReservationController in profile.js");

    //getting username from localstorage

    if($window.localStorage.getItem("username")){

      //  console.log("inside profile.js --> hostReservationController");
            $scope.username = $window.localStorage.getItem("username");
            console.log("localsotrage username inside hostReservationController: ",$window.localStorage.getItem("username"));
    }
    var username = $scope.username;
    data={"username": username}
    $http.post("/getHostReservations",data).then(function(result){

        // get the details of reservations from db and asssign it to scope.listings for display
        if(!result){
            winston.info("result not recieved:: inside http call /getHostReservations");
        }
        else{
            console.log(result.data.bills[0]);
            $scope.listings=result.data.bills;
        }
    });
    
});
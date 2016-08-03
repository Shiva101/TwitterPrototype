
var app = angular.module('tweetApp', ['ngRoute']);

/*app.controller('mainController', function($scope){
	$scope.posts = [];
	//$scope.newPosts = {create_by: '',text:'', create_at: ''};

	$scope.post = function(){
	    $scope.newPost.created_at = Date.now();
	    $scope.posts.push($scope.newPost);
	    $scope.newPost = {created_by: '', text: '', created_at: ''};
	 };
});*/

app.controller('mainController', function($scope, $http){
  $scope.tweet_created_at = Date.now();
  $scope.followerCount= 0;
  $scope.followingCount= 0;      

  $scope.postTweets = function(){
  $http({
      method : "POST",
      url : '/addNewTweet',
      data : {
        "tweet_created_at": $scope.tweet_created_at,
        "tweet_text": $scope.tweet_text
      }
    }).success(function(data) {
      //checking the response data for statusCode
      if (data.statusCode == 401) {
        $scope.invalid_login = false;
        $scope.unexpected_error = true;
      }
      else
        //Making a get call to the '/redirectToHomepage' API
        window.location.assign("/homepage");
    }).error(function(error) {
      $scope.unexpected_error = false;
      $scope.invalid_login = true;
    });
  }// end posttweet

  $scope.searchTweets = function(){
    var q = $scope.searchKeyword;
    console.log("searchKeyword is " + q);

  $http({
      method : "GET",
      url : "/search/"+q,
      data : { "q": q
      }
    }).success(function(response) {
      window.location.assign("/search/" +q);
      $scope.myTweets=response;
    }).error(function(error) {
      
    });
  };  // end searchTweets users


    


/*
  $scope.getAllUsers = function(){
  $http({
      method : "GET",
      url : "/getAllUsers",
      data : {      
      }
    }).success(function(response) {
        $scope.allUsers = response;
        window.location.assign("/faillogin"); 
    }).error(function(error) {
      
    });
  };// end getall users  */

    getFollowingCount = function(){    
        $http({
           method : "GET",
           url : "/getFollowingCount",
           data : { 
        }
        }).success(function (response) {
          $scope.followingCount= response.length ;
      });
    }  // end function  getFollowingCount 
    
    getFollowersCount = function(){    
        $http({
           method : "GET",
           url : "/getFollowersCount",
           data : { 
        }
        }).success(function (response) {
          $scope.followersCount= response.length ;
      });
    }  // end function  getFollowingCount 

    window.onload = function(){    
    $http({
         method : "GET",
         url : "/getMyTweets",
         data : { 
    }
    }).success(function (response) {
        $scope.myTweets = response.jsonParse;
        $scope.tweetcount= response.rowcount;
        getFollowingCount();
        getFollowersCount();
    });
    }  // end sample function  getMyTweets

});

app.controller('authController', function($scope){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';

  $scope.login = function(){
    //placeholder until authentication is implemented
    $scope.error_message = 'login request for ' + $scope.user.username;
  };

  $scope.register = function(){
    //placeholder until authentication is implemented
    $scope.error_message = 'registeration request for ' + $scope.user.username;
  };
});


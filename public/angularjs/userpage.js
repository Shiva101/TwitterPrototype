
var app = angular.module('userpage', ['ngRoute']);

app.controller('mainController', function($scope, $http, $location){
    $scope.followerCount= 0;
    $scope.followingCount= 0;      
    isFollowing  = function(){    
        var userpath= $location.absUrl();
        exp = userpath.split("/"); //to array
        if (exp[3]=="user"){
        var user = exp[4];

        $http({
           method : "POST",
           url : "/isFollowing",
           data : { "userpagename" : user
        }
        }).success(function (response) {
            if (response === "true") {
              $scope.followbutton=true;
              $scope.followingbutton=false;   
            }
          else{
            //  not following 
              $scope.followbutton=false;
              $scope.followingbutton=true;   
            }
      });
    }}  // end function  isFollowing 

    getFollowingCount = function(){    
        var userpath= $location.absUrl();
        exp = userpath.split("/"); //to array
        if (exp[3]=="user"){
        var user = exp[4];

        $http({
           method : "POST",
           url : "/getFollowingCount",
           data : { "userpagename" : user
        }
        }).success(function (response) {
          $scope.followingCount= response.length ;
        
      }).error(function (error) {
        
      });
    }}  // end function  getFollowingCount 

    getFollowersCount = function(){    
       var userpath= $location.absUrl();
       exp = userpath.split("/"); //to array
        if (exp[3]=="user"){
        var user = exp[4];
        $http({
           method : "POST",
           url : "/getFollowersCount",
           data : { "userpagename" : user
        }
        }).success(function (response) {
          $scope.followerCount= response.length ;
          
      }).error(function (error) {
          
      });
    }}  // end function  getFollowersCount 

    window.onload = function(){    
      var userpath= $location.absUrl();
      exp = userpath.split("/"); //to array
      if (exp[3]=="user"){
      var user = exp[4];
      console.log("username is userpage is " + user);

      $http({
         method : "POST",
         url : "/getUserTweets",
         data : { "user" : user
      }
      }).success(function (response) {
        var sessionuser = response.sessionuser;
        $scope.myTweets = response.jsonParse;
        $scope.tweetcount= response.rowcount;
        getFollowingCount();
        getFollowersCount();
        isFollowing();
        console.log("Session user is  " + sessionuser);        
          if (sessionuser === user){
            $scope.buttons = true ;
          } 
          else{
            $scope.buttons = false;
          }        
    });
    }}  // end sample function  getMyTweets onload 
   

    $scope.searchTweets = function(){
    var q = $scope.searchKeyword;

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


        $scope.follow  = function(){    
        var userpath= $location.absUrl();
        exp = userpath.split("/"); //to array
        if (exp[3]=="user"){
        var user = exp[4];

        $http({
           method : "POST",
           url : "/follow",
           data : { "userpagename" : user
        }
        }).success(function (response) {
              $scope.followbutton=true;
              $scope.followingbutton=false;   
                $scope.followerCount = $scope.followerCount +1;
      });
    }}  // end function  follow


      $scope.unfollow  = function(){    
        var userpath= $location.absUrl();
        exp = userpath.split("/"); //to array
        if (exp[3]=="user"){
        var user = exp[4];

        $http({
           method : "POST",
           url : "/unfollow",
           data : { "userpagename" : user
        }
        }).success(function (response) {
              $scope.followbutton=false;
              $scope.followingbutton=true;   
              $scope.followerCount = $scope.followerCount -1;
      });
    }}  // end function  follow


}); // main controller end });


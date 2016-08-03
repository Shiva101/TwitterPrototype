
var app = angular.module('searchTweets', ['ngRoute']);

app.controller('mainController', function($scope, $http, $location){
  $scope.tweet_created_at = Date.now();
  
    window.onload = function(){    
      var userpath= $location.absUrl();
      exp = userpath.split("/"); //to array
      if (exp[3]=="search"){
      var q = exp[4];
      console.log("Search in angular is " + q);

      $http({
         method : "POST",
         url : "/getSearchTweets",
         data : { "q" : q
      }
      }).success(function (response) {
        $scope.myTweets = response;
        
    });
    }}  // end sample function  getMyTweets

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

});


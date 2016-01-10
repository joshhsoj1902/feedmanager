var feedUI = angular.module('feedUI', []);


feedUI.factory('UserService', [function() {
  var user = {
    isLogged: false,
    username: ''
  };
  return user;
}]);

feedUI.controller('authCtrl',function($scope,$http,$location,UserService,$timeout) {
    
    $scope.user  = {username:'',password:''};
    $scope.alert = '';
    $scope.isUserLoggedIn = false;
    console.log("authControl");
    console.log("UserService",UserService);
    
    function getCurrentUser(done){
        $http.get('/auth/currentuser').
            success(function (data) {
                console.log("getCurrentUser success");
                done(data);
            }).
            error(function () {
                console.log("getCurrentUser fail");
                done(null);
            });
    };
    
    function setUser(user){
        if (typeof user != 'undefined' && user !== null) {
            UserService.username = user.username;
            UserService.isLogged = true;
            $scope.loggeduser = user;
            $scope.isUserLoggedIn = true;
        }else{
            $scope.loggeduser = null;
            $scope.isUserLoggedIn = false;
            UserService.isLogged = false;
            UserService.username = '';
        }
        
    };
    
    // function getUser(){
    //     var user = {
    //         username : UserService.username
    //     }
    //     return 
    // };
    
    
    $scope.login = function(user){
        console.log("login");
        $http.post('/auth/login', user).
            success(function(data) {
                setUser(data);
                $location.path('/profile');
            }).
            error(function() {
                $scope.alert = 'Login failed';
                setUser(null);
            });
 
    };
    
    $scope.signup = function(user){
        $http.post('/auth/signup', user).
            success(function(data) {
                $scope.alert = data.alert;
             }).
            error(function() {
                $scope.alert = 'Registration failed';
                // $scope.isUserLoggedIn = false;
                // UserService.isLogged = false;
                // UserService.username = '';
            });
 
    };
   
    $scope.profile = function() {
        getCurrentUser(function(user) {
            if (typeof user != 'undefined' && user !== null){
                console.log("Not Undefined: ",user);
                $scope.loggeduser = user;           
            }else{
                console.log("Undefined: ",user);
                $location.path('/signin');
            }
        });
    }
    
        $scope.logout = function(){
            console.log("logout");
        $http.get('/auth/logout')
            .success(function() {
                setUser(null);
                // $scope.loggeduser = {};
                // $scope.isUserLoggedIn = false;
                // UserService.isLogged = false;
                // UserService.username = '';
                $location.path('/home');
 
            })
            .error(function() {
                $scope.alert = 'Logout failed'
            });
    };

});

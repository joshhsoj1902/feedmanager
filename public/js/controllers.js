var feedControllers = angular.module('feedControllers', []);


// module.factory( 'AuthService', function() {
//   var currentUser;

//   return {
//     login: function() { ... },
//     logout: function() { ... },
//     isLoggedIn: function() { ... },
//     currentUser: function() { return currentUser; }
//     ...
//   };
// });

feedControllers.controller('authCtrl',function($scope,$http,$location) {
    
    $scope.user  = {username:'',password:''};
    $scope.alert = '';
    console.log("authControl");
    console.log("SCOPE",$scope);
    
    
    $scope.login = function(user){
        console.log("login");
        $http.post('/auth/login', user).
            success(function(data) {
                $scope.loggeduser = data;
                console.log("loggeduser; ",$scope.loggeduser);
                console.log("loggeduser.username; ",$scope.loggeduser.username);
                $location.path('/profile');
            }).
            error(function() {
                $scope.alert = 'Login failed'
            });
 
    };
    
    $scope.signup = function(user){
        $http.post('/auth/signup', user).
            success(function(data) {
                $scope.alert = data.alert;
             }).
            error(function() {
                $scope.alert = 'Registration failed'
            });
 
    };
    
    $scope.profile = function() {
        console.log("Profile1");
        $http.get('/auth/currentuser').
            success(function (data) {
                 console.log("Profile2:",data);
                $scope.loggeduser = data;
            }).
            error(function () {
                 console.log("Profile3");
                $location.path('/signin');
            });
    }
 
    //     $scope.userinfo = function() {
    //     $http.get('/auth/currentuser').
    //         success(function (data) {
    //             $scope.loggeduser = data;
    //         }).
    //         error(function () {
    //             $location.path('/signin');
    //         });
    // }
});


// fakebookControllers.controller('accountCtrl', function($scope) {
// 	$scope.master = {	firstName: "John", 
// 						lastName: "Doe",
// 						username: "JoDo",
// 						email:"JohnDoe@gmail.com",
// 						password:""
// 					};
//     $scope.reset = function() {
//         $scope.user = angular.copy($scope.master);
//     };
// 	//TODO:How do i pass this back to the server and insert it into the db?
// 	//http://stackoverflow.com/questions/20136368/how-to-get-data-from-a-form-in-angularjs-express-app
//     $scope.reset();
// });
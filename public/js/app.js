var feed = angular.module('feed', ['ngRoute', 'feedUI']);

feed.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
    when('/home', {
      templateUrl: 'views/home.html',
      controller: 'authCtrl'
    }).
    // when('/login', {
    //    templateUrl: '/views/login.html',
    //    controller: 'authCont'
    // }).
    when('/signup', {
      templateUrl: 'views/signup.html',
      controller: 'authCtrl'
    }).
    when('/profile', {
      templateUrl: 'views/profile.html',
      controller: 'authCtrl'
    }).otherwise({
        redirectTo: '/home'
      });
    // use the HTML5 History API and remove # from URLs
    $locationProvider.html5Mode({enabled: true, requireBase: false});
  }
]);

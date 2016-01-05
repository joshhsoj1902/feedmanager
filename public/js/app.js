var feed = angular.module('feed', ['ngRoute', 'feedControllers']);

feed.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
    when('/home', {
      templateUrl: 'views/home.html',
      controller: 'homeCtrl'
    }).
    when('/account', {
      templateUrl: 'views/account.html',
      controller: 'accountCtrl'
    }).
    when('/signup', {
      templateUrl: 'views/signup.html',
      controller: 'signupCtrl'
    }).
    when('/profile', {
      templateUrl: 'views/profile.html',
      controller: 'profileCtrl'
    }).
    otherwise({
      redirectTo: '/home'
    });
    // use the HTML5 History API and remove # from URLs
    $locationProvider.html5Mode({enabled: true, requireBase: false});
  }
]);

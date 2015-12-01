var fakebook = angular.module('fakebook', ['ngRoute', 'fakebookControllers']);

fakebook.config(['$routeProvider', '$locationProvider',
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
    otherwise({
      redirectTo: '/home'
    });
    // use the HTML5 History API and remove # from URLs
    $locationProvider.html5Mode({enabled: true, requireBase: false});
  }
]);

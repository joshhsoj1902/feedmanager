var fakebookControllers = angular.module('fakebookControllers', []);

fakebookControllers.controller('homeCtrl', function($scope) {
});

fakebookControllers.controller('accountCtrl', function($scope) {
	$scope.master = {	firstName: "John", 
						lastName: "Doe",
						username: "JoDo",
						email:"JohnDoe@gmail.com",
						password:""
					};
    $scope.reset = function() {
        $scope.user = angular.copy($scope.master);
    };
	//TODO:How do i pass this back to the server and insert it into the db?
	//http://stackoverflow.com/questions/20136368/how-to-get-data-from-a-form-in-angularjs-express-app
    $scope.reset();
});
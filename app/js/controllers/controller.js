var lraBackendAppCtrl = angular.module('lraBackendCtrl', [
	'ngMaterial'
]);

lraBackendAppCtrl.controller('lraBackendCtrl.mainCtrl', ['$scope', '$mdSidenav', '$http' function($scope, $mdSidenav, $http){
	
	$http.get("http://www.runoob.com/try/angularjs/data/Customers_JSON.php")
		.success(function(response) {
			$scope.names = response.records;
		});
	
	
	$scope.menus = [
		{
			"id": "menuOrder",
			"name": "注文"
		}, 
		{
			"id": "menuTicket",
			"name": "チケット"
		}, 
		{
			"id": "menuRemainings",
			"name": "残数"
		}
	];
	$scope.navId = "sideMenu";
	
	$scope.toggleMenu = function(navId) {
        $mdSidenav(navId).toggle();
	};
}]);
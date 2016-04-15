'use strict';

angular.module('lraBackend', [
	'ngRoute',
	'ngMaterial',
	'lraBackendCtrl'
]).config(['$routeProvider', '$mdThemingProvider', function($routeProvider, $mdThemingProvider) { 
	$mdThemingProvider.theme('default')
		.primaryPalette('grey')
		.accentPalette('blue-grey');

	$routeProvider.
		when('/ticket', {
			templateUrl: 'views/ticket/list/list.html',
			controller: 'TicketListCtrl'
		}).
		when('/ticket/:ticketId', {
			templateUrl: 'views/ticket/detail/detail.html',
			controller: 'TicketDetailCtrl'
		}).
		otherwise({
			redirectTo: '/ticket'
		});
}]);
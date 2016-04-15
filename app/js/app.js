'use strict';

var lraBackendApp = angular.module('lraBackend', [
	'ngRoute',
	'ngMaterial',
	'lraBackendResource',
	'lraBackendCtrl'
]);

lraBackendApp.config(['$routeProvider', '$mdThemingProvider', function($routeProvider, $mdThemingProvider) { 
	$mdThemingProvider.theme('default')
		.primaryPalette('grey')
		.accentPalette('blue-grey');

	$routeProvider.
		when('/ticket', {
			templateUrl: 'views/ticket/ticket-list.html',
			controller: 'TicketListCtrl'
		}).
		when('/ticket/:ticketId', {
			templateUrl: 'views/ticket/ticket-detail.html',
			controller: 'TicketDetailCtrl'
		}).
		otherwise({
			redirectTo: '/ticket'
		});
}]);
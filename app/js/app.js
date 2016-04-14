'use strict';

// Declare app level module which depends on views, and components
angular.module('lraBackend', [
	'ngRoute',
	'lraBackend.ticket.list',
	'lraBackend.ticket.detail',
	'lraBackend.application.list',
	'lraBackend.application.detail'
]).config(['$routeProvider', function($routeProvider) {
	$routeProvider.otherwise({redirectTo: '/view1'});
}]);
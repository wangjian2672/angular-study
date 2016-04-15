'use strict';

angular.module('lraBackend.ticket.list', ['ngRoute']).config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/ticket', {
		templateUrl: 'ticket/list.html',
		controller: 'TicketListCtrl'
	});
}])

.controller('TicketListCtrl', [function() {

}]);
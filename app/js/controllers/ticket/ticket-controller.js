'use strict';

angular.module('lraBackend')
.controller('TicketListCtrl', ['$scope', 'Ticket', function($scope, Ticket){
	Ticket.search().then(function(obj){
		$scope.tickets = obj.tickets;
		$scope.count = obj.count;
	});
}])
.controller('TicketSearchCtrl', ['$scope', 'Ticket', function($scope, Ticket){
	$scope.statusList = [{
		code: "",
		name: ""
	},{
		code: "BACKEND_TICKET_VALIDATE",
		name: "有効"
	}, {
		code: "BACKEND_TICKET_USED",
		name: "申請中"
	}, {
		code: "BACKEND_TICKET_ISSUED",
		name: "発行済"
	}, {
		code: "BACKEND_TICKET_REVOKED",
		name: "失効済み"
	}];
	
	$scope.ticket = {
		statusCode: $scope.statusList[0].code
	}
	
	$scope.searchTicket = function(){
		Ticket.searchTicket($scope.ticket);
	};
}]);
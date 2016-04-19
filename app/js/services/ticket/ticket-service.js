'use strict';

angular.module('lraBackend').service('Ticket', ['$location', 'lraBackendRouteConst', 'Util', function($location, lraBackendRouteConst, Util){
	var ticket = {};
	var self = this;
	this.searchTicket = function(ticket) {
		self.init(ticket);
		$location.path(lraBackendRouteConst.ticket.list);
	};
	
	this.init = function(obj){
		ticket = obj;
	};
	
	this.get = function(){
		return ticket;
	}
	
	this.reset = function(){
		ticket = {};
	}
	
	this.search = function(){
		var oCondition = self.get();
		
		return;
	}
}]);
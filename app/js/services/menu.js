'use strict';

angular.module('lraBackend').service('Menu', ['Util', 'SsoUtil', '$mdSidenav', function(Util, SsoUtil, $mdSidenav){
	this.toggleMenu = function(navId) {
		$mdSidenav(navId).toggle();
	};
	this.openMenu = function($mdOpenMenu, $event) {
		$mdOpenMenu($event);
	};
	this.logout = function(){
		SsoUtil.logout();
	};
	
	this.getAll = function () {
		return [{
			"id": "menuOrder",
			"name": "注文"
		}, {
			"id": "menuTicket",
			"name": "チケット"
		}, {
			"id": "menuRemainings",
			"name": "残数"
		}];
	}
}]);
'use strict';

angular.module('lraBackendMenuService', ['lraBackendUtilService']).service('Menu', ['Util', function(Util){
	this.constants = {
		ICON_URL: "img/icons/menu.svg",
		NAV_ID: "sideMenu"
	};
	
	this.methods = {
		toggleMenu: function(navId) {
			$mdSidenav(navId).toggle();
		}
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
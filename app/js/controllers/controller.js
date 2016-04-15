'use strict';

angular.module('lraBackendCtrl', [
	'ngMaterial',
	'lraBackendMenuService'
])
.controller('lraBackendCtrl.mainCtrl', ['$scope', '$mdSidenav', '$http', 'Menu', function($scope, $mdSidenav, $http, Menu){
	$scope.menus = Menu.getAll();
	$scope.menuSvg = Menu.constants.ICON_URL;
	$scope.navId =  Menu.constants.NAV_ID;
	$scope.toggleMenu = Menu.methods.toggleMenu;
}]);
'use strict';

angular.module('lraBackend').constant('MenuConst', {
	NAVI_ICON_URL: "img/icons/menu.svg",
	USER_ICON_URL: "img/icons/user.svg",
	NAVI_MENU: "navMenu",
	USER_MENU: "userMenu"
}).controller('LoginCtrl', ['$scope', '$location', '$q', 'SsoUtil', 'lraBackendRouteConst', function($scope, $location, $q, SsoUtil, lraBackendRouteConst){
	$scope.submit = function(){
		SsoUtil.authenticate($scope.loginId, $scope.password).then(function(isLoggedOn) {
			if (isLoggedOn == true) {
				$location.url(lraBackendRouteConst.ticket.search);
			} else {
				$scope.loginForm.loginErrors = {
					authenticateError: true
				};
				
			}
		});
	}
}]).controller('mainCtrl', ['$scope', '$http', 'Menu', 'MenuConst', function($scope, $http, Menu, MenuConst){
	$scope.menus = Menu.getAll();
	
	$scope.userName = "王　健成";

	$scope.menuBase = {
		navSvg: MenuConst.NAVI_ICON_URL,
		userSvg: MenuConst.USER_ICON_URL,
		navMenu: MenuConst.NAVI_MENU,
		userMenu: MenuConst.USER_MENU
	};
	$scope.toggleMenu = Menu.toggleMenu;
	$scope.openMenu = Menu.openMenu;
	$scope.logout = Menu.logout;
}]);
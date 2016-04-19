'use strict';

angular.module('lraBackend').directive('lraMenu', function(){
	return {
		restrict: 'E',
		template: "<div ng-controller='mainCtrl'>" + 
					"<md-toolbar layout='row' md-whiteframe='z2'>" + 
						"<div flex='66' layout='row' layout-align='start center'>" + 
							"<md-button class='md-fab md-accent' ng-click='toggleMenu(\"{{menuBase.navMenu}}\")' aria-label='メニュー'>" + 
								"<md-icon md-svg-src='{{menuBase.navSvg}}'></md-icon>" + 
							"</md-button>" + 
						"</div>" + 
						"<div flex='33' layout='row' layout-align='end center'>" + 
							"<md-menu>" + 
								"<md-button class='md-accent' ng-click='openMenu($mdOpenMenu, $event)' aria-label='ユーザ'>" + 
									"<span class='md-accent'>{{userName}}</span>" + 
									"<md-icon md-svg-src='{{menuBase.userSvg}}'></md-icon>" + 
								"</md-button>" + 
								"<md-menu-content width='4'>" + 
									"<md-menu-item>" + 
										"<md-button ng-click='logout()'>" + 
											"ログアウト" + 
										"</md-button>" + 
									"</md-menu-item>" + 
								"</md-menu-content>" + 
							"</md-menu>" + 
						"</div>" + 
					"</md-toolbar>" + 
					"<div flex layout='row' md-whiteframe='4'>" + 
						"<md-sidenav class='md-sidenav-left' md-component-id='{{menuBase.navMenu}}' md-is-locked-open='$mdMedia(\"gt-md\")' md-disable-backdrop flex='30'>" + 
							"<md-content layout-padding>" + 
								"<md-list ng-cloak>" + 
									"<md-list-item ng-repeat='menu in menus'>" + 
										"<md-button>" + 
											"{{menu.name}}" + 
										"</md-button>" + 
									"</md-list-item>" + 
								"</md-list>" + 
							"</md-content>" + 
						"</md-sidenav>" + 
					"</div>" + 
				"</div>"
	}
});
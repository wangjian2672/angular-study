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
					"<lra-bottom></lra-bottom>" +  
				"</div>"
	}
}).directive('lraBottom', function(){
	return {
		restrict: 'E',
		template: "<md-bottom-sheet class='md-grid' layout='column' ng-cloak>" + 
						"<div>" + 
							"<md-list flex layout='row' layout-align='center cenger'>" + 
								"<md-list-item ng-repeat='menu in menus'>" + 
									"<div>" + 
										"<md-button class='md-grid-item-content' ng-click='listItemClick(menu.id)'>" + 
											"<md-icon md-svg-src='{{menu.icon}}'></md-icon>" + 
											"<div class='md-grid-text'> {{ menu.name }} </div>" + 
										"</md-button>" + 
									"</div>" + 
								"</md-list-item>" + 
							"</md-list>" + 
						"</div>" + 
					"</md-bottom-sheet>"
	}
});
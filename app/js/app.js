'use strict';

angular.module('lraBackend', [
	'ngRoute',
	'ngMaterial',
	'ngMessages'
]).constant('CordysConst', {
	BASE_URL: "http://192.168.56.102/home/LRA/",
	GATEWAY_URL: "com.eibus.web.soap.Gateway.wcp",
	PRE_LOGIN_INFO_URL: "com.eibus.sso.web.authentication.PreLoginInfo.wcp",
	SAMLART_NAME: "SAMLart",
	SAML_ARTIFACT_COOKIE_NAME: "defaultinst_SAMLart",
	SAML_ARTIFACT_COOKIE_PATH: "/",
	CHECK_NAME: "defaultinst_ct",
	USER_AVATAR_IMAGE_URL: "img/",
	USER_AVATAR_DEFAULT_IMAGE: "default"
}).constant('NamespaceConst', {
	CLIENT_ATTRIBUTES_SCHEMA_NAMESPACE: "http://schemas.cordys.com/General/ClientAttributes/",
	SOAP_NAMESPACE: "http://schemas.xmlsoap.org/soap/envelope/",
	I18N_NAMESPACE: "http://www.w3.org/2005/09/ws-i18n",
	CORDSY_NAMESPACE: "http://schemas.cordys.com/General/1.0/",
	WSSE_NAMESPACE: "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd",
	WSU_NAMESPACE: "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd",
	SAMLPROTOCOL_NAMESPACE: "urn:oasis:names:tc:SAML:1.0:protocol",
	SAML_NAMESPACE: "urn:oasis:names:tc:SAML:1.0:assertion"
}).constant('HttpMethod', {
	GET: "GET",
	POST: "POST",
	PUT: "PUT",
	DELETE: "DELETE"
}).constant('lraBackendRouteConst', {
	ticket: {
		search: '/ticket-search',
		list: '/ticket',
		detail: '/ticket/:ticketId'
	},
	order: {
		list: '/order',
		detail: '/order/:orderId'
	},
	application: {
		list: '/application',
		detail: '/application/:applicationId'
	},
	login: '/login'
}).config(['$routeProvider', '$mdThemingProvider', '$httpProvider', 'lraBackendRouteConst', function($routeProvider, $mdThemingProvider, $httpProvider, lraBackendRouteConst) { 
  
	$mdThemingProvider.theme('default')
		.primaryPalette('blue')
		.accentPalette('grey');

	$routeProvider.
		when(lraBackendRouteConst.ticket.search, {
			templateUrl: 'views/ticket/ticket-search.html',
			controller: 'TicketSearchCtrl',
			resolve: {
				loggedIn: function (SsoUtil) {
					return SsoUtil.validateLoggedOnBeforeRedirect();
				}
			}
		}).
		when(lraBackendRouteConst.ticket.list, {
			templateUrl: 'views/ticket/ticket-list.html',
			controller: 'TicketListCtrl',
			resolve: {
				loggedIn: function (SsoUtil) {
					return SsoUtil.validateLoggedOnBeforeRedirect();
				}
			}
		}).
		when(lraBackendRouteConst.ticket.detail, {
			templateUrl: 'views/ticket/ticket-detail.html',
			controller: 'TicketDetailCtrl',
			resolve: {
				loggedIn: function (SsoUtil) {
					return SsoUtil.validateLoggedOnBeforeRedirect();
				}
			}
		}).
		when(lraBackendRouteConst.login, {
			templateUrl: 'views/login.html',
			controller: 'LoginCtrl'
		}).
		otherwise({
			redirectTo: lraBackendRouteConst.login
		});
}]);
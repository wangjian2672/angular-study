'use strict';

angular.module('lraBackend').service('WebServiceUtil', ['$window', '$http', '$q', 'CookieUtil', 'CordysConst', 'HttpMethod', 'lraBackendRouteConst', 
	function($window, $http, $q, CookieUtil, CordysConst, HttpMethod, lraBackendRouteConst){
		var self = this;
		this.userLang = navigator.language;
		
		this._errorCallback = function(){
			var d = $q.defer();
			d.resolve(false);
			return d.promise;
		};
		
		this.asyncRequestWithMethod = function(url, method, request){
			var deferred = $q.defer(); 
			$http({
				method: method, 
				url: url,
				headers: {
				   'Content-Type': undefined
				},
				data: request
			}). success(function(data, status, headers, config) {  
				deferred.resolve(data); 
			}). error(function(data, status, headers, config) {  
				deferred.reject(data); 
			}); 
			return deferred.promise;
		};
		
		this.callCordysWebserviceUseAnonymous = function(request){
			let useAnonymous = true;
			return self.callCordysWebservice(request, useAnonymous);
		};
		
		this.callCordysWebservice = function(request, useAnonymous){
			if (!useAnonymous) {
				// If there is not a saml artifact in cookie, then redirect to Login page.
				let cookie = CookieUtil.get(CordysConst.SAML_ARTIFACT_COOKIE_NAME);
				if (!cookie) {
					// redirect to Login page.
					CookieUtil.remove(CordysConst.SAML_ARTIFACT_COOKIE_NAME, CordysConst.SAML_ARTIFACT_COOKIE_PATH);
					$location.url(lraBackendRouteConst.login);
					return;
				}
			}
				
			let url = CordysConst.BASE_URL + CordysConst.GATEWAY_URL + "?language=" + self.userLang;
			if (!useAnonymous) {
				url = url + "&" + CordysConst.SAMLART_NAME + "=" +
				$window.encodeURIComponent(CookieUtil.get(CordysConst.SAML_ARTIFACT_COOKIE_NAME));
			} 
			
			return self.asyncRequestWithMethod(url, HttpMethod.POST, request);
		};
		
		this.callCordysWebserviceWithUrl = function(url){
			return self.asyncRequestWithMethod(url, HttpMethod.POST);
		};
}]);
'use strict';

angular.module('lraBackend').service('SsoUtil', [
	'$location', '$q', '$http', 'lraBackendRouteConst', 'WebServiceUtil', 'XmlUtil', 'DateUtil', 'CookieUtil', 'User', 'CordysConst', 'NamespaceConst', 'HttpMethod', 
	function($location, $q, $http, lraBackendRouteConst, WebServiceUtil, XmlUtil, DateUtil, CookieUtil, User, CordysConst, NamespaceConst, HttpMethod){
	var self = this;
	
	this.authenticate = function(userId, password) {
		if (!userId || !password) {
			User.reset();
			return WebServiceUtil._errorCallback();
        } else {
			return WebServiceUtil.asyncRequestWithMethod('asserts/requests/saml_assertion_request.xml', HttpMethod.GET).then(function(req) {
				let samlRequest = XmlUtil.parseXML(req);
				XmlUtil.setXMLNamespaces(samlRequest, {
					"SOAP": NamespaceConst.SOAP_NAMESPACE,
					"wsse": NamespaceConst.WSSE_NAMESPACE,
					"wsu": NamespaceConst.WSU_NAMESPACE,
					"samlp": NamespaceConst.SAMLPROTOCOL_NAMESPACE,
					"saml": NamespaceConst.SAML_NAMESPACE
				});

				let createRequestID = function() {
					// wdk XXX: use guid generator?
					let gid = "a"; // XML validation requires that the request ID does not start with a number
					for (let i = 0; i < 32; i++) {
						gid += Math.floor(Math.random() * 0xF).toString(0xF) + (i == 8 || i == 12 || i == 16 || i == 20 ? "-" : "");
					}
					return gid;
				}

				// set RequestID, IssueInstant and NameIdentifier
				XmlUtil.selectXMLNode(samlRequest, "SOAP:Envelope/SOAP:Body/samlp:Request").setAttribute("RequestID", createRequestID());
				XmlUtil.selectXMLNode(samlRequest, "SOAP:Envelope/SOAP:Body/samlp:Request").setAttribute("IssueInstant", DateUtil.getUTCDate());
				XmlUtil.setNodeText(samlRequest, ".//saml:NameIdentifier", userId);

				// Remove security node if no wsse username is used 
				let headerNode = XmlUtil.selectXMLNode(samlRequest, "SOAP:Envelope/SOAP:Header");
				let securityNode = XmlUtil.selectXMLNode(samlRequest, ".//wsse:Security");
				if (password == null) password = "";

				XmlUtil.setNodeText(samlRequest, ".//wsse:Username", userId);
				XmlUtil.setNodeText(samlRequest, ".//wsse:Password", password);

				req = XmlUtil.xml2string(samlRequest);

				return WebServiceUtil.callCordysWebserviceUseAnonymous(req).then(function(data) {
					var d = $q.defer();
					let samlResponse = XmlUtil.parseXML(data);
					XmlUtil.setXMLNamespaces(samlResponse, {
						"SOAP": NamespaceConst.SOAP_NAMESPACE,
						"wsse": NamespaceConst.WSSE_NAMESPACE,
						"wsu": NamespaceConst.WSU_NAMESPACE,
						"samlp": NamespaceConst.SAMLPROTOCOL_NAMESPACE,
						"saml": NamespaceConst.SAML_NAMESPACE
					});

					let authenticationResult = false;
					let assertions = XmlUtil.selectXMLNode(samlResponse, ".//saml:Assertion");
					if (assertions != null) {
						let samlArtifact = XmlUtil.getNodeText(samlResponse, ".//samlp:AssertionArtifact", null);
						if (samlArtifact) {
							let notOnOrAfterString = XmlUtil.getNodeText(samlResponse, ".//saml:Conditions/@NotOnOrAfter", null);
							if (notOnOrAfterString) {
								let notOnOrAfterDate = DateUtil.transferCordysDateStringToUTC(notOnOrAfterString);
								CookieUtil.set(CordysConst.SAML_ARTIFACT_COOKIE_NAME, samlArtifact, notOnOrAfterDate, CordysConst.SAML_ARTIFACT_COOKIE_PATH);
								authenticationResult = true;    
							}
						}
					}
					User.setLoginId(userId);
					d.resolve(authenticationResult);
					return d.promise;
				}, function(error){
					User.reset();
					return WebServiceUtil._errorCallback();
				});
			}, function(error){
				User.reset();
				return WebServiceUtil._errorCallback();
			});
        }
	};
	
	this.loggedOn = function(){
		let isLoggedOn = false;
        let cookie = CookieUtil.get(CordysConst.SAML_ARTIFACT_COOKIE_NAME);
        isLoggedOn = cookie != null && cookie != "";
        return isLoggedOn;
	};
	
	this.logout = function(){
		CookieUtil.remove(CordysConst.SAML_ARTIFACT_COOKIE_NAME, CordysConst.SAML_ARTIFACT_COOKIE_PATH);
		$location.url(lraBackendRouteConst.login);
	};
	
	this.validateLoggedOnBeforeRedirect = function(){
		var deferred = $q.defer();
		let isLoggedOn = false;
        let cookie = CookieUtil.get(CordysConst.SAML_ARTIFACT_COOKIE_NAME);
        isLoggedOn = cookie != null && cookie != "";
		if (isLoggedOn) {
			deferred.resolve(); 
		} else {
			deferred.reject();
			$location.url(lraBackendRouteConst.login);
		}
        return deferred.promise;
	};
}]);
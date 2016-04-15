'use strict';

angular.module('lraBackendSsoService', ['lraBackendXmlService']).service('SsoUtil', ['XmlUtil', function(XmlUtil){
	var self = this;
	this.constants = {
		GATEWAY_URL: "com.eibus.web.soap.Gateway.wcp",
		PRE_LOGIN_INFO_URL: "com.eibus.sso.web.authentication.PreLoginInfo.wcp",
		SAMLART_NAME: "SAMLart",
		CLIENT_ATTRIBUTES_SCHEMA_NAMESPACE: "http://schemas.cordys.com/General/ClientAttributes/",
		SOAP_NAMESPACE: "http://schemas.xmlsoap.org/soap/envelope/",
		I18N_NAMESPACE: "http://www.w3.org/2005/09/ws-i18n",
		CORDSY_NAMESPACE: "http://schemas.cordys.com/General/1.0/",
		WSSE_NAMESPACE: "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd",
		WSU_NAMESPACE: "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd",
		SAMLPROTOCOL_NAMESPACE: "urn:oasis:names:tc:SAML:1.0:protocol",
		SAML_NAMESPACE: "urn:oasis:names:tc:SAML:1.0:assertion",
		POST: "POST"
	};
	
	this.authenticate = function(userId, password) {
		if (!userId || !password) {
            return false;
        } else {
			self.asyncRequestWithMethod('assets/requests/saml_assertion_request.xml', self.constants.POST).then(function(req) {
				let samlRequest = XmlUtil.parseXml(req);
				XmlUtil.setXMLNamespaces(samlRequest, {
					"SOAP": self.constants.SOAP_NAMESPACE,
					"wsse": self.constants.WSSE_NAMESPACE,
					"wsu": self.constants.WSU_NAMESPACE,
					"samlp": self.constants.SAMLPROTOCOL_NAMESPACE,
					"saml": self.constants.SAML_NAMESPACE
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
				XmlUtil.selectXMLNode(samlRequest, "SOAP:Envelope/SOAP:Body/samlp:Request").setAttribute("IssueInstant", Util.getUTCDate());
				XmlUtil.setNodeText(samlRequest, ".//saml:NameIdentifier", userId);

				// Remove security node if no wsse username is used 
				let headerNode = XmlUtil.selectXMLNode(samlRequest, "SOAP:Envelope/SOAP:Header");
				let securityNode = XmlUtil.selectXMLNode(samlRequest, ".//wsse:Security");
				if (password == null) password = "";

				XmlUtil.setNodeText(samlRequest, ".//wsse:Username", userId);
				XmlUtil.setNodeText(samlRequest, ".//wsse:Password", password);

				req = XmlUtil.xml2string(samlRequest);

				Util.callCordysWebserviceUseAnonymous(req).then(function(data) {
					let samlResponse = XmlUtil.parseXml(data);
					XmlUtil.setXMLNamespaces(samlResponse, {
						"SOAP": self.constants.SOAP_NAMESPACE,
						"wsse": self.constants.WSSE_NAMESPACE,
						"wsu": self.constants.WSU_NAMESPACE,
						"samlp": self.constants.SAMLPROTOCOL_NAMESPACE,
						"saml": self.constants.SAML_NAMESPACE
					});

					let assertions = XmlUtil.selectXMLNode(samlResponse, ".//saml:Assertion");
					let authenticationResult = false;
					if (assertions != null) {
						let samlArtifact = XmlUtil.getNodeText(samlResponse, ".//samlp:AssertionArtifact", null);
						if (samlArtifact) {
							let notOnOrAfterString = XmlUtil.getNodeText(samlResponse, ".//saml:Conditions/@NotOnOrAfter", null);
							if (notOnOrAfterString) {
								let notOnOrAfterDate = Util.transferCordysDateStringToUTC(notOnOrAfterString);
								Util.setCookie(Util.constants.SAML_ARTIFACT_COOKIE_NAME, samlArtifact, notOnOrAfterDate, Util.constants.SAML_ARTIFACT_COOKIE_PATH);
								authenticationResult = true;    
							}
						}
					}
					resolve(authenticationResult);
				});
            });
        }
	};
	
	this.loggedOn = function(){
		let isLoggedOn = false;
        let cookie = Util.getCookie(Util.constants.SAML_ARTIFACT_COOKIE_NAME);
        isLoggedOn = cookie != null && cookie != "";
        return isLoggedOn;
	};
	
	this.asyncRequestWithMethod = function(url, method){
		var deferred = $q.defer(); 
		$http({
			method: method, 
			url: url
		}). success(function(data, status, headers, config) {  
			deferred.resolve(data); 
		}). error(function(data, status, headers, config) {  
			deferred.reject(data); 
		}); 
		return deferred.promise;
	};
}]);
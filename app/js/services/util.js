'use strict';

angular.module('lraBackendUtilService', [
	'lraBackendXmlService', 
	'lraBackendSsoService', 
	'lraBackendCookieService', 
	'lraBackendDateService'
]).service('Util',  ['XmlUtil', 'SsoUtil', 'CookieUtil', 'DateUtil', '$http', '$q', function(XmlUtil, SsoUtil, CookieUtil, DateUtil, $http, $q){
	var self = this;
	
	this.userLang = navigator.language;
	
	this.constants = {
		BASE_URL: "http://192.168.56.102/home/InternalSystem/",
        GATEWAY_URL: "com.eibus.web.soap.Gateway.wcp",
        PRE_LOGIN_INFO_URL: "com.eibus.sso.web.authentication.PreLoginInfo.wcp",
        SAMLART_NAME: "SAMLart",
        SAML_ARTIFACT_COOKIE_NAME: "defaultinst_SAMLart",
        SAML_ARTIFACT_COOKIE_PATH: "/",
        CHECK_NAME: "defaultinst_ct",
        USER_AVATAR_IMAGE_URL: "img/",
        USER_AVATAR_DEFAULT_IMAGE: "default",
		GET: "GET",
		POST: "POST",
		PUT: "PUT",
		DELETE: "DELETE"
	};
	
	this.getBrowser = function(){
		return XmlUtil.getBrowser();
	};
	
	this.isIE = function(){
		return XmlUtil.isIE();
	};
	
	this.isWebKit = function(){
        return XmlUtil.isWebKit();
	};
	
	this.parseXml = function(s) {
        return XmlUtil.parseXML(s);
    };

    this.xml2json = function(xml) {
        return XmlUtil.xml2json(xml);
    };

    this.xml2string = function(xml) {
        return XmlUtil.xml2string(xml);
    };

    this.setNodeText = function(node, xpath, value, namespaces) {
        return XmlUtil.setNodeText(node, xpath, value, namespaces);
    };

    this.getNodeText = function(node, xpath, defaultValue, namespaces) {
        return XmlUtil.getNodeText(node, xpath, defaultValue, namespaces);
    };

    this.selectXMLNode = function(object, xpathExpression, namespaces) {
        return XmlUtil.selectXMLNode(object, xpathExpression, namespaces);
    };

    this.selectXMLNodes = function(object, xpathExpression, namespaces) {
        return XmlUtil.selectXMLNodes(object, xpathExpression, namespaces);
    };

    this.setXMLNamespaces = function(object, namespaces) {
        return XmlUtil.setXMLNamespaces(object, namespaces);
    };

    this.getXMLAttribute = function(elementNode, attributeNamespace, attributeName) {
        return XmlUtil.getXMLAttribute(elementNode, attributeNamespace, attributeName);
    };

    this.setXMLAttribute = function(elementNode, attributeNamespace, attributeName, attributeValue) {
        return XmlUtil.setXMLAttribute(elementNode, attributeNamespace, attributeName, attributeValue);
    };
	
	this.callCordysWebserviceUseAnonymous = function(request){
		let useAnonymous = true;
        return self.callCordysWebservice(request, useAnonymous);
	};
	
	this.callCordysWebservice = function(request, useAnonymous){
		if (!useAnonymous) {
            // If there is not a saml artifact in cookie, then redirect to Login page.
            let sso = SsoUtil.init();
            if (!sso.loggedOn()) {
                // redirect to Login page.
                return;
            }
        }
		
		let url = self.constants.BASE_URL + self.constants.GATEWAY_URL;
		if (!useAnonymous) {
			url = url + "?" + self.constants.SAMLART_NAME + "=" +
			self.getCookie(self.constants.SAML_ARTIFACT_COOKIE_NAME);
		} 
		
		url = url + "?language=" + self.userLang;	
		
		return self.asyncRequestWithMethod(url, self.constants.POST);
	};
	
	this.callCordysWebserviceWithUrl = function(url){
		return self.asyncRequestWithMethod(url, self.constants.POST);
	};
	
	this.asyncRequestWithMethod = function(url, method){
		return SsoUtil.asyncRequestWithMethod(url, method);
	};
	
	this.setCookie = function(name, value, end, path, domain, secure){
		CookieUtil.set(name, value, end, path, domain, secure);
	};
	
	this.getCookie = function(name) {
		return CookieUtil.get(name);
	};

	this.removeCookie = function(name, path){
		return CookieUtil.remove(name, path);
	};
	
	this.hasCookie = function(name){
		return CookieUtil.has(name);
	};
	
	this.getUserIdFromAuthUserDn = function(authUserDn) {
        var position = authUserDn.indexOf(",cn=");
        let userId = "";
        if (position > 0) {
            userId = authUserDn.substring(3, position);
        }
        return userId;
    };
	
	this.getUTCDate = function() {
        return DateUtil.getUTCDate();
    }
}]);
'use strict';

angular.module('lraBackend').service('Util',  [
	'$http', '$q', 'CookieUtil', 'XmlUtil', 'DateUtil', 'SsoUtil', 'WebServiceUtil', 'HttpMethod', 'CordysConst', 
	function($http, $q, CookieUtil, XmlUtil, DateUtil, SsoUtil, WebServiceUtil, HttpMethod, CordysConst){
		var self = this;
		
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
		};
		
		this.transferCordysDateStringToUTC = function(dateString) {
			return DateUtil.transferCordysDateStringToUTC(dateString);
		};
}]);
'use strict';

angular.module('lraBackend').service('User', ['$q', 'WebServiceUtil', 'XmlUtil', 'HttpMethod', function($q, WebServiceUtil, XmlUtil, HttpMethod){
	var user = {};
	var self = this;
	
	this.getLoginId = function(){
		return user.loginId;
	};
	
	this.setLoginId = function(id){
		user.loginId = id;
	};
	
	this.reset = function(){
		user = {};
	};
	
	this.getUserDetail = function(){
		return WebServiceUtil.asyncRequestWithMethod('asserts/requests/cordys_user_detail_request.xml', HttpMethod.GET).then(function(req) {
			return WebServiceUtil.callCordysWebservice(req).then(function(data) {
				var d = $q.defer();
				let oResponse = XmlUtil.parseXML(data);
				user.loginId = XmlUtil.getNodeText(oResponse, ".//*[local-name()='UserName']", "");
				user.userName = XmlUtil.getNodeText(oResponse, ".//*[local-name()='Description']", "");
				d.resolve(user);
				return d.promise;
			}, function(error){
				return WebServiceUtil._errorCallback();
			});
		}, function(error){
			return WebServiceUtil._errorCallback();
		});
	};
}]);
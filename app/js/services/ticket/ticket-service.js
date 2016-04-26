'use strict';

angular.module('lraBackend').service('Ticket', ['$q', 'WebServiceUtil', 'XmlUtil', 'HttpMethod', '$location', 'lraBackendRouteConst', function($q, WebServiceUtil, XmlUtil, HttpMethod, $location, lraBackendRouteConst){
	var ticket = {};
	var self = this;
	this.searchTicket = function(ticket) {
		self.init(ticket);
		$location.path(lraBackendRouteConst.ticket.list);
	};
	
	this.init = function(obj){
		ticket = obj;
	};
	
	this.get = function(){
		return ticket;
	}
	
	this.reset = function(){
		ticket = {};
	}
	
	this.search = function(){
		var oCondition = self.get();
		return WebServiceUtil.asyncRequestWithMethod('asserts/requests/get_management_ledger_list_request.xml', HttpMethod.GET).then(function(req) {
			let oRequest = XmlUtil.parseXML(req);
			XmlUtil.setNodeText(oRequest, ".//*[local-name()='ticketNo']", oCondition.ticketNo, "");
			XmlUtil.setNodeText(oRequest, ".//*[local-name()='companyCode']", oCondition.companyCode, "");
			XmlUtil.setNodeText(oRequest, ".//*[local-name()='employeeName']", oCondition.userName, "");
			XmlUtil.setNodeText(oRequest, ".//*[local-name()='status']", oCondition.statusCode, "");
			req = XmlUtil.xml2string(oRequest);
			return WebServiceUtil.callCordysWebservice(req).then(function(data) {
				var d = $q.defer();
				let oResponse = XmlUtil.parseXML(data);
				// チケット一覧
				var oTickets = XmlUtil.selectXMLNodes(oResponse, ".//*[local-name()='ManagementLedgerOutput']");
				var ticketList = {};
				var aTickets = [];
				if (oTickets) {
					for (var i = 0; i < oTickets.length; i++) {
						aTickets.push(XmlUtil.xml2json(oTickets[i]).ManagementLedgerOutput);
					}
				}
				ticketList.tickets = aTickets;
				// 最大数
				var oCursor = XmlUtil.selectXMLNode(oResponse, ".//*[local-name()='cursor']");
				var maxCount = XmlUtil.getXMLAttribute(oCursor, "", "maxRows");
				ticketList.count = maxCount.value;
				
				d.resolve(ticketList);
				return d.promise;
			}, function(error){
				return WebServiceUtil._errorCallback();
			});
		}, function(error){
			return WebServiceUtil._errorCallback();
		});
	}
}]);
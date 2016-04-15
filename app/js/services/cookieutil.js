'use strict';

angular.module('lraBackendCookieService', []).service('CookieUtil', function($window){
	var self = this;
	
	this.get = function(name){
		if (!name || !self.has(name)) {
            return null;
        }
        return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
	};
	
	this.set = function(name, value, end, path, domain, secure){
		if (!name || /^(?:expires|max\-age|path|domain|secure)$/i.test(name)) {
            return;
        }
        var expires = "";
        if (end) {
            switch (end.constructor) {
                case Number:
                    expires = end === Infinity ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; max-age=" + end;
                    break;
                case String:
                    expires = "; expires=" + end;
                    break;
                case Date:
                    expires = "; expires=" + end.toGMTString();
                    break;
            }
        }
        document.cookie = escape(name) + "=" + escape(value) + expires + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "") + (secure ? "; secure" : "");
	};
	
	this.remove = function(name, path){
		if (!name || !self.has(name)) {
            return;
        }
        document.cookie = escape(name) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (path ? "; path=" + path : "");
	}
	
	this.has = function(name){
		return (new RegExp("(?:^|;\\s*)" + escape(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
	};
});
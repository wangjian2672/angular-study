'use strict';

angular.module('lraBackendXmlService', []).service('XmlUtil', ['$window', function($window){
	var self = this;
	
	this.getBrowser = function(){
		var ua = $window.navigator.userAgent.toLowerCase();
        var ver = $window.navigator.appVersion.toLowerCase();
        var name = 'unknown';

        if (ua.indexOf("msie") != -1) {
            if (ver.indexOf("msie 6.") != -1) {
                name = 'ie6';
            } else if (ver.indexOf("msie 7.") != -1) {
                name = 'ie7';
            } else if (ver.indexOf("msie 8.") != -1) {
                name = 'ie8';
            } else if (ver.indexOf("msie 9.") != -1) {
                name = 'ie9';
            } else if (ver.indexOf("msie 10.") != -1) {
                name = 'ie10';
            } else {
                name = 'ie';
            }
        } else if (ua.indexOf('trident/7') != -1) {
            name = 'ie11';
        } else if (ua.indexOf('chrome') != -1) {
            name = 'chrome';
        } else if (ua.indexOf('safari') != -1) {
            name = 'safari';
        } else if (ua.indexOf('opera') != -1) {
            name = 'opera';
        } else if (ua.indexOf('firefox') != -1) {
            name = 'firefox';
        }
        return name;
	};
	
	this.isIE = function(){
		return this.getBrowser().indexOf("ie") >= 0;
	};
	
	this.isWebKit = function(){
		var ua = $window.navigator.userAgent;
        return ua.indexOf("AppleWebKit") >= 0;
	};
	
	this.parseXML = function(data){
		var xml, tmp;
        if (!data || typeof data !== "string") {
            return null;
        }
        try {
            if ($window.DOMParser) { // Standard
                tmp = new DOMParser();
                xml = tmp.parseFromString(data, "text/xml");
            } else { // IE
                xml = new ActiveXObject("Microsoft.XMLDOM");
                xml.async = "false";
                xml.loadXML(data);
            }
        } catch (e) {
            xml = undefined;
        }
        if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
            throw new Error("Invalid XML: " + data);
        }
        return xml;
	};
	
	this.xml2json = function(xml, options){
		 // default options based on https://github.com/Leonidas-from-XIV/node-xml2js
        var defaultOptions = {
            attrkey: '$',
            charkey: '_',
            normalize: false,
            explicitArray: false
        };

        var n;

        if (!xml) {
            return xml;
        }

        options = options || {};

        for (n in defaultOptions) {
            if (defaultOptions.hasOwnProperty(n) && options[n] === undefined) {
                options[n] = defaultOptions[n];
            }
        }

        if (typeof xml === 'string') {
            xml = self.parseXML(xml).documentElement;
        }

        var root = {};
        if (typeof xml.attributes === 'undefined' || xml.attributes === null) {
            root[xml.nodeName] = self.xml2jsonImpl(xml, options);
        } else if (xml.attributes && xml.attributes.length === 0 && xml.childElementCount === 0) {
            root[xml.nodeName] = self.normalize(xml.textContent, options);
        } else {
            root[xml.nodeName] = self.xml2jsonImpl(xml, options);
        }

        return root;
	};
	
	this.xml2jsonImpl = function(xml, options){
		var i, result = {}, attrs = {}, node, child, name;
        result[options.attrkey] = attrs;

        if (xml.attributes && xml.attributes.length > 0) {
            for (i = 0; i < xml.attributes.length; i++) {
                var item = xml.attributes.item(i);
                attrs[item.nodeName] = item.value;
            }
        }

        // element content
        if (xml.childElementCount === 0) {
            result[options.charkey] = self.normalize(xml.textContent, options);
        }

        for (i = 0; i < xml.childNodes.length; i++) {
            node = xml.childNodes[i];
            if (node.nodeType === 1) {
                if (node.attributes.length === 0 && node.childElementCount === 0) {
                    child = self.normalize(node.textContent, options);
                } else {
                    child = self.xml2jsonImpl(node, options);
                }

                name = node.nodeName;
                if (result.hasOwnProperty(name)) {
                    // For repeating elements, cast/promote the node to array
                    var val = result[name];
                    if (!Array.isArray(val)) {
                        val = [val];
                        result[name] = val;
                    }
                    val.push(child);
                } else if (options.explicitArray === true) {
                    result[name] = [child];
                } else {
                    result[name] = child;
                }
            }
        }
        return result;
	};
	
	this.xml2string = function(xml){
		return new XMLSerializer().serializeToString(xml);
	};
	
	this.createNSResolver = function(xmlDocument){
		if (xmlDocument.__namespaces) {
			return function(prefix) {
				return xmlDocument.__namespaces[prefix] || null;
			}
		}
		return null;
	};
	
	this.createElementNS = function(xmlDocument, namespaceURI, qualifiedName){
		if (self.isIE()) {
			return xmlDocument.createNode(1, qualifiedName, namespaceURI); //NOMBV
		} else if (self.isWebKit()) {
			var elementNode = xmlDocument.createElementNS(namespaceURI, qualifiedName);
			// There is a bug in webkit, that after createElementNS is done with xmlns="", then 
			// the xmlns attribute is not visible anymore while doing cordys.getXML.
			// See http://code.google.com/p/chromium/issues/detail?id=27598 for more details.
			if (!namespaceURI) {
				var namespaceAttr = xmlDocument.createAttribute("xmlns");
				namespaceAttr.value = "";
				elementNode.attributes.setNamedItem(namespaceAttr);
			}
			return elementNode;
		} else {
			return xmlDocument.createElementNS(namespaceURI, qualifiedName);
		}
	};
	
	this.getNodeText = function(node, xpath, defaultValue, namespaces){
		if (node && (node = self.selectXMLNode(node, xpath, namespaces))) {
			return (self.getTextContent(node) || defaultValue);
		}
		return defaultValue;
	};
	
	this.setNodeText = function(node, xpath, value, namespaces){
		if (node && (node = self.selectXMLNode(node, xpath, namespaces))) {
			self.setTextContent(node, value);
			return true;
		}
		return false;
	};
	
	this.setTextContent = function(node, textContent){
		if (typeof(node) == 'object') {
			textContent = textContent != null ? textContent : "";
			var property = 'textContent' in node ? "textContent" : (node.uniqueID ? "innerText" : "text");
			node[property] = textContent;
		}
	};
	
	this.getTextContent = function(node) {
		if (typeof(node) == 'object') {
			textContent = textContent != null ? textContent : "";
			var property = 'textContent' in node ? "textContent" : (node.uniqueID ? "innerText" : "text");
			node[property] = textContent;
		}
	};
	
	this.setXMLNamespaces = function(object, namespaces){
		if (self.isIE()) {
			var xmlDocument = (object.ownerDocument || object);
			var res = "";
			for (var prefix in namespaces) {
				if (prefix.indexOf("xml") == 0 || !namespaces[prefix]) continue;
				if (res.length > 0) res += " ";
				res += "xmlns:" + prefix + "='" + namespaces[prefix] + "'";
			}
			xmlDocument.setProperty("SelectionNamespaces", res); //NOMBV
		} else {
			var xmlDocument = (object.ownerDocument || object);
			xmlDocument.__namespaces = namespaces;
		}
	};
	
	this.getXMLNamespaces = function(object){
		if (self.isIE()) {
			var xmlDocument = (object.ownerDocument || object);
			var documentNamespaces = xmlDocument.getProperty("SelectionNamespaces"); //NOMBV
			if (documentNamespaces) {
				//Checking the space after ' of namespace only
				documentNamespaces = documentNamespaces.replace(/\bxmlns:([^\s]*)\b/g, "$1").split("' ");
				var namespaces = {};
				for (var i = 0, length = documentNamespaces.length; i < length; i++) {
					var xmlns = documentNamespaces[i].split("=");
					if (!xmlns[0] || !xmlns[1]) continue;
					var ns = xmlns[1];
					var endIndex = (i == documentNamespaces.length - 1) ? ns.length - 1 : ns.length;
					namespaces[xmlns[0]] = ns.slice(1, endIndex);
				}
				return namespaces;
			}
			return null;
		} else {
			var xmlDocument = (object.ownerDocument || object);
			return (xmlDocument.__namespaces || null);
		}
	};
	
	this.appendXMLNode = function(fromNode, toNode){
		if (self.isIE()) {
			return toNode.appendChild(fromNode); //NOMBV
		} else {
			var toNodeDocument = toNode.ownerDocument || toNode;
			if (fromNode.ownerDocument != toNodeDocument) {
				fromNode = toNodeDocument.adoptNode(fromNode);
			}
			var toNodeDocFragment = toNodeDocument.createDocumentFragment();
			var newNode = toNodeDocFragment.appendChild(fromNode); //NOMBV
			toNode.appendChild(toNodeDocFragment); //NOMBV
			return newNode;
		}
	};
	
	this.selectXMLNode = function(object, xpathExpression, namespaces){
		if (self.isIE()) {
			try {
				var xmlDocument = (object.ownerDocument || object);
				var isXSLPattern = (xmlDocument.getProperty("SelectionLanguage") === "XSLPattern");
				if (isXSLPattern) {
					xmlDocument.setProperty("SelectionLanguage", "XPath");
				}
				if (namespaces) {
					var savedNamespaces = xmlDocument.getProperty("SelectionNamespaces"); //NOMBV
					self.setXMLNamespaces(xmlDocument, namespaces);
				}
				var result = object.selectSingleNode(xpathExpression); //NOMBV
				if (namespaces) {
					xmlDocument.setProperty("SelectionNamespaces", savedNamespaces); //NOMBV
				}
				if (isXSLPattern) {
					xmlDocument.setProperty("SelectionLanguage", "XSLPattern");
				}
				return result;
			} catch (e) {}
		} else {
			try {
				var xmlDocument = (object.ownerDocument || object);
				if (namespaces) {
					var savedNamespaces = (xmlDocument.__namespaces || null);
					xmlDocument.__namespaces = namespaces;
				}
				var result = xmlDocument.evaluate(xpathExpression, object, self.createNSResolver(xmlDocument),
					XPathResult.FIRST_ORDERED_NODE_TYPE, null);
				if (namespaces) {
					xmlDocument.__namespaces = savedNamespaces;
				}
				if (result) return result.singleNodeValue;
				return null;
			} catch (e) {
				//var t_error = translate("selectXMLNode: expression ' {0} ' cannot be evaluated.");
				//throw CordysRoot.Localization.makeCompositeText(t_error, xpathExpression) + e.message;
			}
		}
	};
	
	this.selectXMLNodes = function(object, xpathExpression, namespaces){
		if (self.isIE()) {
			try {
				var xmlDocument = (object.ownerDocument || object);
				var isXSLPattern = (xmlDocument.getProperty("SelectionLanguage") === "XSLPattern");
				if (isXSLPattern) {
					xmlDocument.setProperty("SelectionLanguage", "XPath");
				}
				if (namespaces) {
					var savedNamespaces = xmlDocument.getProperty("SelectionNamespaces"); //NOMBV
					self.setXMLNamespaces(xmlDocument, namespaces);
				}
				var result = object.selectNodes(xpathExpression); //NOMBV
				if (namespaces) {
					xmlDocument.setProperty("SelectionNamespaces", savedNamespaces); //NOMBV
				}
				if (isXSLPattern) {
					xmlDocument.setProperty("SelectionLanguage", "XSLPattern");
				}
				return result;
			} catch (e) {}
		} else {
			try {
				// Wrapper type for the result of cordys.selectXMLNodes()
				function XMLSelectionList(context, xpathExpression) {
					this._current = 0;
					this.context = context;
					this.expr = xpathExpression;
					this.length = 0;
				}

				XMLSelectionList.prototype.item = function(i) {
					return this[i] || null;
				};
				XMLSelectionList.prototype.nextNode = function() {
					return this[this._current++] || null
				};
				XMLSelectionList.prototype.reset = function() {
					this._current = 0;
				};

				var result = new XMLSelectionList(object, xpathExpression);
				var xmlDocument = (object.ownerDocument || object);
				if (namespaces) {
					var savedNamespaces = (xmlDocument.__namespaces || null);
					xmlDocument.__namespaces = namespaces;
				}
				var nodeList = xmlDocument.evaluate(xpathExpression, object, self.createNSResolver(xmlDocument),
					XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
				var node, nodeIndex = 0;
				if (node = nodeList.iterateNext()) {
					do {
						result[nodeIndex++] = node;
					} while (node = nodeList.iterateNext())
					result.length = nodeIndex;
				}
				if (namespaces) {
					xmlDocument.__namespaces = savedNamespaces;
				}
				return result;
			} catch (e) {
				//var t_error = translate("selectXMLNodes: expression ' {0} ' cannot be evaluated.");
				//throw CordysRoot.Localization.makeCompositeText(t_error, xpathExpression) + e.message;
			}
		}
	};
	
	this.createAttributeNS = function(object, namespaceURI, qualifiedName){
		var xmlDocument = (object.ownerDocument || object);
        if (self.isIE()) {
            return xmlDocument.createNode(2, qualifiedName, namespaceURI); 
        } else {
           return xmlDocument.createAttributeNS(namespaceURI, qualifiedName);
        }
	};
	
	this.getXMLAttribute = function(elementNode, attributeNamespace, attributeName){
		if (self.isIE()) {
            return elementNode.getAttributeNode(attributeName);
        } else {
            var nsPrefixIndex = attributeName.indexOf(":");
			if ( nsPrefixIndex > 0) attributeName = attributeName.substr(nsPrefixIndex+1);
			return elementNode.getAttributeNodeNS(attributeNamespace, attributeName);
        }
	};
	
	this.setXMLAttribute = function(elementNode, attributeNamespace, attributeName, attributeValue){
		if (self.isIE()) {
            var attributeNode = self.createAttributeNS(elementNode.ownerDocument, attributeNamespace, attributeName);
			attributeNode.nodeValue = attributeValue;
			return elementNode.setAttributeNode(attributeNode);
        } else if(self.isWebKit()) {
            var attributeNode = self.getXMLAttribute(elementNode, attributeNamespace, attributeName);
			if(attributeNode)
			{
				attributeNode.nodeValue = attributeValue;
				return attributeNode;
			}
			attributeNode = self.createAttributeNS(elementNode.ownerDocument, attributeNamespace, attributeName);
			attributeNode.nodeValue = attributeValue;
			return elementNode.setAttributeNodeNS(attributeNode);
        } else {
            var attributeNode = self.createAttributeNS(elementNode.ownerDocument, attributeNamespace, attributeName);
			attributeNode.nodeValue = attributeValue;
			return elementNode.setAttributeNodeNS(attributeNode);
        }
	};
}]);
var xmldom = require('xmldom');
var DOMParser = xmldom.DOMParser;

function FunctionalModule(name, loadOnStartup) {
	this.name = name;
	this.loadOnStartup = loadOnStartup || false;

	this.jsModules = []; // String[]
	this.dependentModules = []; // String[]
	this.views = []; // String[]
}

/* STATIC METHODS */
FunctionalModule.loadModules = function loadModulesFromXmlDocument(documentElement) {
    var modules = [];
    var xmlElements = documentElement.getElementsByTagName('functionalModule');

    for (var i = 0; i < xmlElements.length; i++)
      modules.push(FunctionalModule.loadModule(xmlElements[i]));

    return modules;
}

FunctionalModule.loadModule = function loadModuleFromXmlElement(xmlElement) {
  if (xmlElement.nodeName != 'functionalModule')
    throw "XML node is not from a functional module";

  var getIdentifierList = (tagName) => {
    var elements = xmlElement.getElementsByTagName(tagName)[0];
    if (!!elements)
      return elements.firstChild.nodeValue.split(',').map(text => text.trim());
    return [];
  };

  var module = new FunctionalModule(xmlElement.getAttribute('name'), false);
  if (xmlElement.hasAttribute('loadOnStartUp'))
    module.loadOnStartup = xmlElement.getAttribute('loadOnStartUp').toLowerCase() === 'true';

  module.jsModules = getIdentifierList('jsModules');
  module.views = getIdentifierList('views');
  module.dependentModules = getIdentifierList('dependentModules');

  return module;
}

/* METHODS */
FunctionalModule.prototype.toXMLNode = function() {
  var dom = new DOMParser().parseFromString('<functionalModule/>');
  var doc = dom.documentElement;
  doc.setAttribute('name', this.name);
  doc.setAttribute('loadOnStartUp', this.loadOnStartup);

  var appendIdentifierListNode = (ids, nodeName) => {
    if (ids && ids.length) {
      var node = dom.createElement(nodeName);
      var text = dom.createTextNode(ids.join(','));
      node.appendChild(text);
      doc.appendChild(node);
    };
  }

  appendIdentifierListNode(this.jsModules, 'jsModules');
  appendIdentifierListNode(this.views, 'views');
  appendIdentifierListNode(this.dependentModules, 'dependentModules');

  return doc;
};

FunctionalModule.prototype.toString = function() {
  return this.name;
};

module.exports = FunctionalModule;

(function() {
	document.addEventListener('readystatechange', () => document.readyState === 'complete' && init());

	function init() {
    console.log('App initialized...')
  }

	var fs = require('fs');
	var FunctionalModule = require('./FunctionalModule');

	fs.readFile(__dirname + '/test/functionalModules.xml', 'utf8', function (err, data) {
	  if (err) throw err;

	  var doc = new DOMParser().parseFromString(data, 'text/xml');

	  var fms = FunctionalModule.loadModules(doc.documentElement);
	  console.log(fms);
	  document.write(fms);
	});
}());
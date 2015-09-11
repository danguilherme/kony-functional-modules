var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Open the devtools.
  mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });










  var FunctionalModule = require('./FunctionalModule');

  var fs = require('fs');
  var xmldom = require('xmldom');
  var DOMParser = xmldom.DOMParser;

  fs.readFile(__dirname + '/test/functionalModules.xml', 'utf8', function (err, data) {
    if (err) throw err;

    var doc = new DOMParser().parseFromString(data, 'text/xml');
    // doc.documentElement.setAttribute('x','y');
    // doc.documentElement.setAttributeNS('./lite','c:x','y2');
    // var nsAttr = doc.documentElement.getAttributeNS('./lite','x')
    // console.info(nsAttr)
    // console.info(doc)
  });

  function getModules(documentElement) {
  }
});

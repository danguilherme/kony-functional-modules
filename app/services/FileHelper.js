angular.module('FunctionalModulesBuilder')
  .factory('FileHelper', [function FileHelper() {
    var fs = require('fs');

    var remote = require('remote');
    var dialog = remote.require('dialog');

    function chooseSingleFileOrDirectory() {
      return dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ['openFile', 'openDirectory'],
        filters: [{
          name: 'XML Files',
          extensions: ['xml']
        }, {
          name: 'Eclipse Project',
          extensions: ['project']
        }, {
          name: 'All Files',
          extensions: ['*']
        }]
      });
    }

    function fileInfo(location) {
      // https://nodejs.org/api/fs.html#fs_class_fs_stats
      return fs.statSync(location);
    }

    function readDirectory(path) {
      return fs.readdirSync(path);
    }

    function readFile(location, config) {
      return fs.readFileSync(location, config);
    }

    function chooseEclipseProjectFolder() {
      var path = chooseSingleFileOrDirectory();
      if (!path) return false;
      path = path[0];

      var allFiles = readDirectory(path);
      if (allFiles.indexOf('.project') > -1)
        return path; // it's an Eclipse project!

      // Eclipse's .project file is not in this directory, it's not an Eclipse project
      var clickedButtonIdx = dialog.showMessageBox(remote.getCurrentWindow(), {
        type: 'error',
        title: "Not an Eclipse Project",
        message: `"${path}" is not a project from Kony Studio.`,
        detail: "Eclipse folders have a .project file containing project metadata",
        buttons: ["Cancel", "Choose Another Directory"],
        cancelId: 0
      });

      // if clicked in Cancel
      if (clickedButtonIdx == 0)
        return false;
      else
        chooseEclipseProjectFolder(); // let's try again
    }

    /**
     * Reads and deserializes the give functionalModules.xml file
     * @param  {String} location The location of the file in the file system
     * @return {FunctionalModule[]}          Array of JS objects representing module definitions
     */
    function parseFunctionalModulesXml(location) {
      var FunctionalModule = require('./FunctionalModule');
      var DOMParser = require('xmldom').DOMParser;

      var content = readFile(location, 'utf8');
      
      var doc = new DOMParser().parseFromString(content, 'text/xml');
      var functionalModules = FunctionalModule.loadModules(doc.documentElement);

      return functionalModules;
    }

    return {
      chooseSingleFileOrDirectory: chooseSingleFileOrDirectory,

      readDirectory: readDirectory,
      readFile: readFile,

      parseFunctionalModulesXml: parseFunctionalModulesXml,

      chooseEclipseProjectFolder: chooseEclipseProjectFolder,

      fileInfo: fileInfo
    }
  }]);

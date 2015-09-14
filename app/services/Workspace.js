angular.module('FunctionalModulesBuilder')
  .factory('Workspace', ['$localStorage', '$sessionStorage', 'FileHelper',
    function Workspace($localStorage, $sessionStorage, FileHelper) {
      var fs = require('fs');
      var path = require('path');

      const KONY_FILES = ['kony_sdk.js', 'konylibrary.js', 'mbaasconfig.js'];
      const FUNCTIONAL_MODULES_XML_PATH = path.join('functionalmodules', 'functionalModules.xml');

      function setWorkingDirectory(location) {
        var fi = FileHelper.fileInfo(location);
        if (!fi.isDirectory())
          throw "Working directory must be a folder path";

        $sessionStorage.workingDirectory = location;
      }

      function getWorkingDirectory() {
        return $sessionStorage.workingDirectory;
      }

      function assertWorkingDirectorySet() {
        if (!getWorkingDirectory())
          throw "Working directory path must be set before performing the requested action";
      }

      // get all file names under modules/js
      function getScripts() {
        assertWorkingDirectorySet();

        return FileHelper.readDirectory(path.join(getWorkingDirectory(), 'modules/js'))
          // remove folders and Kony files
          .filter(f => !!path.extname(f) && KONY_FILES.indexOf(f) === -1)
          // remove file extension
          .map(f => path.parse(f).name);
      }

      // get all file names under forms/mobile
      function getForms() {
        assertWorkingDirectorySet();

        return FileHelper.readDirectory(path.join(getWorkingDirectory(), 'forms/mobile'))
          // remove file extension
          .map(f => path.parse(f).name);
      }

      function getFunctionalModulesXml() {
        assertWorkingDirectorySet();
        return FileHelper.parseFunctionalModulesXmlToObject(path.join(getWorkingDirectory(), FUNCTIONAL_MODULES_XML_PATH));
      }

      function saveFunctionalModulesToXml(modules) {
        assertWorkingDirectorySet();
        var pd = require('pretty-data').pd;

        var xmlStr = FileHelper.parseFunctionalModuleObjectsToXml(modules);
        fs.writeFile(
          path.join(getWorkingDirectory(), FUNCTIONAL_MODULES_XML_PATH),
          pd.xml(xmlStr),
          function(err) {
            if (err) {
              return console.log(err);
            }



            var remote = require('remote');
            var dialog = remote.require('dialog');
            dialog.showMessageBox(remote.getCurrentWindow(), {
              type: 'info',
              title: "Success",
              message: "File saved successfully",
              buttons: ["OK"]
            });
            console.log("The file was saved!");
          });
      }

      return {
        setWorkingDirectory: setWorkingDirectory,
        getWorkingDirectory: getWorkingDirectory,

        getScripts: getScripts,
        getForms: getForms,
        getFunctionalModulesXml: getFunctionalModulesXml,

        saveFunctionalModulesToXml: saveFunctionalModulesToXml
      }
    }
  ]);

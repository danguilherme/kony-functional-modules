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
      function listModules() {
        assertWorkingDirectorySet();

        return FileHelper.readDirectory(path.join(getWorkingDirectory(), 'modules/js'))
          // remove folders and Kony files
          .filter(f => !!path.extname(f) && KONY_FILES.indexOf(f) === -1);
      }

      function getFunctionalModulesXml() {
        assertWorkingDirectorySet();
        // console.log(path.join(getWorkingDirectory(), FUNCTIONAL_MODULES_XML_PATH));
        return FileHelper.parseFunctionalModulesXml(path.join(getWorkingDirectory(), FUNCTIONAL_MODULES_XML_PATH));
      }

      return {
        setWorkingDirectory: setWorkingDirectory,
        listModules: listModules,
        getFunctionalModulesXml: getFunctionalModulesXml
      }
    }
  ]);

'use strict';

angular.module('FunctionalModulesBuilder')
  .controller('ModulesController', ['$scope', 'FileHelper', 'Workspace',
    function ModulesController($scope, FileHelper, Workspace) {
      // TODO: Check CodeMirror
      var pd = require('pretty-data').pd;

      $scope.modules;
      $scope.selectedModule;

      function getModuleByName(name) {
        return $scope.modules.filter(mod => mod.name === name)[0];
      }

      function selectModule(module) {
        if (typeof(module) === 'string')
          module = getModuleByName(module);

        $scope.selectedModule = module;
        $scope.xml = pd.xml($scope.selectedModule.toXMLNode());
      }

      $scope.selectModule = function(module) {
        selectModule(module);
      }

      $scope.selectDependentModule = function(name) {
        selectModule(name);
      }

      try {
        $scope.modules = Workspace.getFunctionalModulesXml();
      } catch (e) {
        console.warn("Working directory is not set, loading test xml file");
        $scope.modules = FileHelper.parseFunctionalModulesXml(__dirname + '/test/functionalModules.xml');
      }
    }
  ]);

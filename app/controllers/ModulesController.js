'use strict';

angular.module('FunctionalModulesBuilder')
  .controller('ModulesController', ['$scope', 'FileHelper', 'Workspace',
    function ModulesController($scope, FileHelper, Workspace) {
      // TODO: Check CodeMirror
      var pd = require('pretty-data').pd;

      $scope.functionalModules;
      $scope.selectedModule = {};

      function load() {
        try {
          $scope.functionalModules = Workspace.getFunctionalModulesXml();

          $scope.allModules = $scope.functionalModules.map(o => o.name);
          $scope.allScripts = Workspace.getScripts();
          $scope.allForms = Workspace.getForms();

          // scripts that are at least in one functional module
          $scope.referencedScripts = $scope.functionalModules
            .map(x => x.jsModules)
            .reduce((x, y) => x.concat(y), []);

          // views that are at least in one functional module
          $scope.referencedForms = $scope.functionalModules
            .map(x => x.views)
            .reduce((x, y) => x.concat(y), []);

          console.info('FunctionalModules', $scope.functionalModules);
          console.info('FunctionalModules names', $scope.allModules);
          console.info('Scripts', $scope.allScripts);
          console.log($scope.referencedScripts);
          console.info('Views', $scope.allForms);
        } catch (e) {
          console.warn(e.message);

          // var shell = require('shell');
          // shell.openExternal(__dirname + '/test/functionalModules.xml');

          $scope.functionalModules = FileHelper.parseFunctionalModulesXml(__dirname + '/test/functionalModules.xml');
        }
      }

      function getModuleByName(name) {
        return $scope.functionalModules.filter(mod => mod.name === name)[0];
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

      load();
    }
  ]);

'use strict';

angular.module('FunctionalModulesBuilder')
  .controller('ModulesController', ['$scope', 'FileHelper', 'Workspace',
    function ModulesController($scope, FileHelper, Workspace) {
      // TODO: Check CodeMirror
      var pd = require('pretty-data').pd;

      $scope.uiSelect = {
        selectedItem: null
      };

      $scope.functionalModules;
      $scope.selectedModule;

      // changes while user picks stuff
      $scope.functionalModules = Workspace.getFunctionalModulesXml();

      function load() {
        try {
          // read-only properties
          $scope.allModules = $scope.functionalModules.map(o => o.name);
          $scope.allScripts = Workspace.getScripts();
          $scope.allForms = Workspace.getForms();

          updateReferencedContents();

          console.info('FunctionalModules', $scope.functionalModules);
          console.info('FunctionalModules names', $scope.allModules);
          console.info('Scripts', $scope.allScripts);
          console.info('Views', $scope.allForms);
        } catch (e) {
          console.error(e.message);

          // var shell = require('shell');
          // shell.openExternal(__dirname + '/test/functionalModules.xml');

          // $scope.functionalModules = FileHelper.parseFunctionalModulesXml(__dirname + '/test/functionalModules.xml');
        }
      }

      function updateReferencedContents() {
        // scripts that are at least in one functional module
        $scope.referencedScripts = $scope.functionalModules
          .map(x => x.jsModules)
          .reduce((x, y) => x.concat(y), []);

        // views that are at least in one functional module
        $scope.referencedForms = $scope.functionalModules
          .map(x => x.views)
          .reduce((x, y) => x.concat(y), []);
      }

      function getModuleByName(name) {
        return $scope.functionalModules.filter(mod => mod.name === name)[0];
      }

      function selectModule(module) {
        if (typeof(module) === 'string')
          module = getModuleByName(module);

        $scope.selectedModule = module;
      }

      $scope.$watch('selectedModule', mod => mod && ($scope.xml = pd.xml(mod.toXMLNode())), true);

      $scope.selectModule = function(module) {
        selectModule(module);
      }

      $scope.selectDependentModule = function(name) {
        selectModule(name);
      }

      /*
        select new items
       */
      $scope.addView = function(formName) {
        if ($scope.selectedModule.views.indexOf(formName) == -1)
          $scope.selectedModule.views.push(formName);
        updateReferencedContents();
      }
      $scope.addScript = function(scriptName) {
        if ($scope.selectedModule.jsModules.indexOf(scriptName) == -1)
          $scope.selectedModule.jsModules.push(scriptName);
        updateReferencedContents();
      }
      $scope.addDependentModule = function(moduleName) {
        if ($scope.selectedModule.dependentModules.indexOf(moduleName) == -1)
          $scope.selectedModule.dependentModules.push(moduleName);
      }

      load();

      // receives any number of arrays
      $scope.filter_itemIsNotIn = function() {
        var flattenedArray = Array.prototype.slice.call(arguments).reduce((a, b) => (a || []).concat(b));
        return function(item) {
          return flattenedArray && flattenedArray.indexOf(item) === -1;
        }
      }
    }
  ]);

'use strict';

angular.module('FunctionalModulesBuilder')
  .controller('ModulesController', ['$scope', 'FileHelper', 'Workspace',
    function ModulesController($scope, FileHelper, Workspace) {
      // TODO: Check CodeMirror
      var pd = require('pretty-data').pd;
      var xmldom = require('xmldom');
      var DOMParser = xmldom.DOMParser;

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

      function sortFunctionalModules() {
        $scope.functionalModules.sort(function(a, b) {
          if (a.loadOnStartup)
            return -1;
          if (b.loadOnStartup)
            return 1;
          return a.name > b.name;
        });

        $scope.allModules.sort();

        // if ($scope.selectedModule) {
        //   $scope.allScripts.sort(function(a, b) {
        //     if ($scope.selectedModule.jsModules.contains(a))
        //       return -1;
        //     else {
        //       return a > b;
        //     }
        //   });
        // }
      }

      function updateReferencedContents() {
        sortFunctionalModules();

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

      $scope.$watch('selectedModule', function(mod) {
        if (mod)
          $scope.xml = pd.xml(new xmldom.XMLSerializer().serializeToString(mod.toXMLNode()));
        sortFunctionalModules();
      }, true);

      $scope.selectModule = function(module) {
        selectModule(module);
      }

      $scope.selectDependentModule = function(name) {
        selectModule(name);
      }

      $scope.save = function() {
        var dom = new DOMParser().parseFromString('<functionalModules/>');
        var doc = dom.documentElement;
        for (var i = 0; i < $scope.functionalModules.length; i++) {
          doc.appendChild($scope.functionalModules[i].toXMLNode());
        }
        var xmlString = new xmldom.XMLSerializer().serializeToString(doc);
        console.log(pd.xml(xmlString));
      }

      /*
        manage functional modules items
       */

      /**
       * add the given item in the given array if it's unique
       */
      function addItem(array, item) {
        if (!array.contains(item))
          array.push(item);
      }

      function removeItem(array, item) {
        if (array.contains(item)) {
          var idx = array.indexOf(item);
          array.splice(idx, 1);
        }
      }

      function toggleItem(array, item) {
        if (array.contains(item))
          removeItem(array, item);
        else
          addItem(array, item);
      }

      $scope.addView = function(formName) {
        addItem($scope.selectedModule.views, formName);
        updateReferencedContents();
      }
      $scope.removeView = function(formName) {
        removeItem($scope.selectedModule.views, formName);
        updateReferencedContents();
      }
      $scope.toggleView = function(formName) {
        toggleItem($scope.selectedModule.views, formName);
        updateReferencedContents();
      }

      $scope.addScript = function(scriptName) {
        addItem($scope.selectedModule.jsModules, scriptName);
        updateReferencedContents();
      }
      $scope.removeScript = function(scriptName) {
        removeItem($scope.selectedModule.jsModules, scriptName);
        updateReferencedContents();
      }
      $scope.toggleScript = function(scriptName) {
        toggleItem($scope.selectedModule.jsModules, scriptName);
        updateReferencedContents();
      }

      $scope.addDependentModule = function(moduleName) {
        addItem($scope.selectedModule.dependentModules, moduleName);
      }
      $scope.removeDependentModule = function(moduleName) {
        removeItem($scope.selectedModule.dependentModules, moduleName);
      }
      $scope.toggleDependentModule = function(moduleName) {
        toggleItem($scope.selectedModule.dependentModules, moduleName);
      }

      load();

      // receives any number of arrays
      $scope.filter_itemIsNotIn = function() {
        var flattenedArray = Array.prototype.slice.call(arguments).reduce((a, b) => (a || []).concat(b));
        return function(item) {
          return flattenedArray && !flattenedArray.contains(item);
        }
      }
    }
  ]);

'use strict';

angular.module('FunctionalModulesBuilder').
  controller('ModulesController', ['$scope', 'FileHelper', function ModulesController($scope, FileHelper) {
    $scope.modules;
    $scope.selectedModule;

    function getModuleByName(name) {
      return $scope.modules.filter(mod => mod.name === name)[0];
    }

    function selectModule(module) {
      if (typeof(module) === 'string')
        module = getModuleByName(module);

      $scope.selectedModule = module;
    }

    $scope.selectModule = function(module) {
      selectModule(module);
    }

    $scope.selectDependentModule = function(name) {
      selectModule(name);
    }

    $scope.modules = FileHelper.parseFunctionalModulesXml(__dirname + '/test/functionalModules.xml');
  }]);

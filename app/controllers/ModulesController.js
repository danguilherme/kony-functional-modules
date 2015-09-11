'use strict';

angular.module('FunctionalModulesBuilder').
  controller('ModulesController', ['$scope', function ModulesController($scope) {
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

    var fs = require('fs');
    var FunctionalModule = require('./FunctionalModule');
    var data = fs.readFileSync(__dirname + '/test/functionalModules.xml', 'utf8');

    var doc = new DOMParser().parseFromString(data, 'text/xml');

    var functionalModules = FunctionalModule.loadModules(doc.documentElement);
    $scope.modules = functionalModules;

    // fs.readFile(__dirname + '/test/functionalModules.xml', 'utf8', function (err, data) {
    //   if (err) throw err;

    //   var doc = new DOMParser().parseFromString(data, 'text/xml');

    //   var fms = FunctionalModule.loadModules(doc.documentElement);
    //   console.log(fms);
    //   $scope.modules = fms;
    //   $scope.$apply();
    // });
  }]);

'use strict';

angular.module('FunctionalModulesBuilder').
  controller('MainController', ['$scope', function MainController($scope) {
    $scope.modules;
    $scope.name = 'olar';

    var fs = require('fs');
    var FunctionalModule = require('./FunctionalModule');

    fs.readFile(__dirname + '/test/functionalModules.xml', 'utf8', function (err, data) {
      if (err) throw err;

      var doc = new DOMParser().parseFromString(data, 'text/xml');

      var fms = FunctionalModule.loadModules(doc.documentElement);
      console.log(fms);
      $scope.modules = fms;
      $scope.$apply();
    });
  }]);

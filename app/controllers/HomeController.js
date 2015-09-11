'use strict';

angular.module('FunctionalModulesBuilder').
  controller('HomeController', ['$scope', function HomeController($scope) {
    $scope.openFile = function() {
      console.log('openFile');
    }
  }]);

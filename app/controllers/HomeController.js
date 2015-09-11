'use strict';

angular.module('FunctionalModulesBuilder')
  .controller('HomeController', ['$scope', 'FileHelper', function HomeController($scope, FileHelper) {
    function showOpenDialog() {
      var remote = require('remote');
      var dialog = remote.require('dialog');

      var path = null;

      //path = FileHelper.chooseSingleFileOrDirectory();
      path = FileHelper.chooseEclipseProjectFolder();

      console.log(path);
    }

    $scope.openFile = function() {
      showOpenDialog();
    }
  }]);

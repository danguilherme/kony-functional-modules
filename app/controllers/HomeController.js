'use strict';

angular.module('FunctionalModulesBuilder')
  .controller('HomeController', ['$scope', '$state', 'FileHelper', 'Workspace',
    function HomeController($scope, $state, FileHelper, Workspace) {
      function showOpenDialog() {
        var remote = require('remote');
        var dialog = remote.require('dialog');

        var path = null;

        //path = FileHelper.chooseSingleFileOrDirectory();
        path = FileHelper.chooseEclipseProjectFolder();

        if (path) {
          Workspace.setWorkingDirectory(path);
          $state.go('modules');
        }
      }

      $scope.openFile = function() {
        showOpenDialog();
      }
    }
  ]);

var FunctionalModulesBuilder = angular.module('FunctionalModulesBuilder',
  ['ui.router', 'ngStorage']);

FunctionalModulesBuilder.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'app/partials/home.html',
      controller: 'HomeController'
    })
    .state('modules', {
      url: '/modules',
      views: {
        '': {
          templateUrl: 'app/views/modules.html',
          controller: 'ModulesController',
        },
        'nav@modules': {
          templateUrl: 'app/partials/modules/nav.html'
        },
        'moduleEdit@modules': {
          templateUrl: 'app/partials/modules/module-edit.html'
        }
      }
    });

  Array.prototype.contains = function(item) {
    return this.indexOf(item) != -1;
  }
});

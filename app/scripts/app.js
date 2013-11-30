'use strict';

angular.module('genomeExplorerApp', [
  'ngResource',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/genes/:geneId', {
        templateUrl: 'views/gene_summary.html',
        controller: 'GeneCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

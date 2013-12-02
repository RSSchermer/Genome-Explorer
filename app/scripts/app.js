'use strict';

angular.module('genomeExplorerApp', [
  'ngResource',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/gene_list.html',
        controller: 'GeneListCtrl'
      })
      .when('/genes', {
        templateUrl: 'views/gene_list.html',
        controller: 'GeneListCtrl'
      })
      .when('/genes/:geneId', {
        templateUrl: 'views/gene_summary.html',
        controller: 'GeneCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

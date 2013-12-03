'use strict';

angular.module('genomeExplorerApp')
  .controller('GeneCtrl', function ($scope, $routeParams, Restangular) {
    if (null !== $routeParams.geneId) {
      Restangular.one('genes', $routeParams.geneId).get().then(function (gene) {
        $scope.gene = gene;
      });
    }
  });

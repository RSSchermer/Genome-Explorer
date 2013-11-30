'use strict';

angular.module('genomeExplorerApp')
  .controller('GeneCtrl', function ($scope, $routeParams, geBasexGene) {
    if (null !== $routeParams.geneId) {
      $scope.gene = geBasexGene.get({geneId: $routeParams.geneId});
    }
  });

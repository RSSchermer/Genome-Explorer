'use strict';

angular.module('genomeExplorerApp')
  .controller('MainCtrl', function ($scope, geBasexGene) {
    $scope.genes = geBasexGene.query({top: 15, skip: 0});
  });

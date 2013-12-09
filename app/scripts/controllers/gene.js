'use strict';

angular.module('genomeExplorerApp')
  .controller('GeneCtrl', function ($scope, $routeParams, Restangular, $http, SEQUENCE_SERVER_PATH, $window) {
    $scope.zoom = 1;
    
    if (null !== $routeParams.geneId) {
      Restangular.one('genes', $routeParams.geneId).get().then(function (gene) {
        $scope.gene = gene;
        
        Restangular.one('genes', gene.symbol).getExons('exons').then(function (exons) {
          $scope.gene.exons = exons;
        });
        
        $http.get(SEQUENCE_SERVER_PATH + gene.chromosomeId +'?start='+ gene.intervalStart + '&stop='+ gene.intervalStop)
          .then(function (res) {
            $scope.sequence = res.data;
          }
        );
        
        $scope.$emit('readyForTour', true);
      });
    }
    
    $scope.backToList = function() {
      $window.history.back();
    };
  });

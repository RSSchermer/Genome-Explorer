'use strict';

angular.module('genomeExplorerApp')
  .controller('GeneListCtrl', function ($scope, $cacheFactory, Restangular, GENES_PER_PAGE) {
    var self = this,
        cache = $cacheFactory.get('geneListStateCache') || $cacheFactory('geneListStateCache');
    
    this.loadPage = function (scope, pageNum, chromosomeId, searchQuery) {
      Restangular.all('genes').getList({
          top: GENES_PER_PAGE,
          skip: (pageNum - 1) * GENES_PER_PAGE,
          chromosome: chromosomeId,
          search: searchQuery
        }).then(function (genes) {
          scope.genes = genes;
          scope.hasNextPage = genes.metadata.count > pageNum * GENES_PER_PAGE;
          scope.hasPreviousPage = pageNum !== 1;
        }
      );
    };
    
    // Setup controller scope
    $scope.currentPage = cache.get('page') || 1;
    $scope.chromosomeFilter = cache.get('chromosomeFilter');
    $scope.searchQuery = cache.get('searchQuery');
    
    $scope.$watch('currentPage', function () {
      cache.put('page', $scope.currentPage);
      
      self.loadPage($scope, $scope.currentPage, $scope.chromosomeFilter, $scope.searchQuery);
    });
    
    $scope.search = function () {
      var queryLength = $scope.searchQuery ? $scope.searchQuery.length : 0;
      
      if (queryLength !== 0 && queryLength < 4) {
        $scope.searchError = 'Search query must be at least 4 characters long.';
      } else {
        $scope.currentPage = 1;
        $scope.searchError = null;
        
        cache.put('page', $scope.currentPage);
        cache.put('chromosomeFilter', $scope.chromosomeFilter);
        cache.put('searchQuery', $scope.searchQuery);
        
        self.loadPage($scope, $scope.currentPage, $scope.chromosomeFilter, $scope.searchQuery);
      }
    };
    
    self.loadPage($scope, $scope.currentPage, $scope.chromosomeFilter, $scope.searchQuery);
  });

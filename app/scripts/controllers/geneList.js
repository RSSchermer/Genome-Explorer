'use strict';

angular.module('genomeExplorerApp')
  .controller('GeneListCtrl', function ($scope, $routeParams, Restangular, $location, GENES_PER_PAGE) {
    var self = this;
    
    $scope.genesPerPage = GENES_PER_PAGE;
    $scope.currentPage = parseInt($routeParams.page) || 1;
    $scope.chromosomeFilter = $routeParams.chromosome;
    $scope.geneTypeFilter = $routeParams.type;
    $scope.searchQuery = $routeParams.search;
    
    $scope.$emit('readyForTour', true);
    
    Restangular.all('chromosomes').getList().then(function (chromosomes) {
      $scope.chromosomes = chromosomes;
    });
    
    Restangular.all('genes').getList({
        top: GENES_PER_PAGE,
        skip: ($scope.currentPage - 1) * GENES_PER_PAGE,
        chromosome: $scope.chromosomeFilter,
        type: $scope.geneTypeFilter,
        search: $scope.searchQuery
      }).then(function (genes) {
        $scope.genes = genes;
        $scope.hasNextPage = genes.metadata.count > $scope.currentPage * GENES_PER_PAGE;
        $scope.hasPreviousPage = $scope.currentPage !== 1;
        
        $scope.genesLoaded = true;
      }
    );
        
    $scope.$watch('currentPage', function () {
      $location.search(self._buildSearch($scope.currentPage, $scope.chromosomeFilter, $scope.geneTypeFilter, $scope.searchQuery));
    });
    
    $scope.search = function () {
      var queryLength = $scope.searchQuery ? $scope.searchQuery.length : 0;
      
      if (queryLength !== 0 && queryLength < 4) {
        $scope.searchError = 'Search query must be at least 4 characters long.';
      } else {
        $location.search(self._buildSearch(1, $scope.chromosomeFilter, $scope.geneTypeFilter, $scope.searchQuery));
      }
    };
    
    this._buildSearch = function (page, chromosomeId, geneType, searchQuery) {
      var search = {page: page};
      
      if (chromosomeId) {
        search.chromosome = chromosomeId;
      }
      
      if (geneType) {
        search.type = geneType;
      }
      
      if (searchQuery) {
        search.search = searchQuery;
      }
      
      return search;
    };
  });

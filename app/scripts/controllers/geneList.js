'use strict';

angular.module('genomeExplorerApp')
  .controller('GeneListCtrl', function ($scope, $cacheFactory, geBasexGene) {
    var genesPerPage = 15;
    var cachedState = $cacheFactory.get('geneListStateCache') || $cacheFactory('geneListStateCache');
    var pageNum = cachedState.get('page') || 1;
    var chromosomeFilter = cachedState.get('chromosomeFilter') || 0;
    var searchQuery = cachedState.get('searchQuery');
    
    /**
     * Helper function for retrieving gene list for page and updating scope
     * @param {Object} scope   The scope to be updated
     * @param {Int}    pageNum The page number
     */
    var loadPage = function (scope, pageNum, chromosomeId, searchQuery) {
      geBasexGene.query({
          top: genesPerPage,
          skip: (pageNum - 1) * genesPerPage,
          chromosome: chromosomeId,
          search: searchQuery
        },
        function (genes) {
          scope.genes = genes;
          scope.hasNextPage = genes.length >= genesPerPage;
          scope.hasPreviousPage = pageNum !== 1;
        }
      );
    };
    
    // Setup controller scope
    $scope.chromosomeFilter = chromosomeFilter;
    $scope.searchQuery = searchQuery;
    
    loadPage($scope, pageNum, chromosomeFilter, searchQuery);
    
    $scope.nextPage = function () {
      if ($scope.hasNextPage) {
        pageNum++;
        
        cachedState.put('page', pageNum);
        
        loadPage($scope, pageNum, chromosomeFilter, searchQuery);
      }
    };
    
    $scope.previousPage = function () {
      if ($scope.hasPreviousPage) {
        pageNum--;
        
        cachedState.put('page', pageNum);
        
        loadPage($scope, pageNum, chromosomeFilter, searchQuery);
      }
    };
    
    $scope.search = function () {
      var queryLength = $scope.searchQuery ? $scope.searchQuery.length : 0;
      
      if (queryLength !== 0 && queryLength < 4) {
        $scope.searchError = 'Search query must be at least 4 characters long.';
      } else {
        $scope.searchError = null;
        
        pageNum = 1;
        chromosomeFilter = $scope.chromosomeFilter;
        searchQuery = $scope.searchQuery;
        
        cachedState.put('page', 1);
        cachedState.put('chromosomeFilter', chromosomeFilter);
        cachedState.put('searchQuery', searchQuery);
        
        loadPage($scope, pageNum, chromosomeFilter, searchQuery);
      }
    };
  });

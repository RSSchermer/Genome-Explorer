'use strict';

angular.module('genomeExplorerApp')
  .factory('geBasexGene', function ($resource) {
    return $resource('http://localhost:9876/genedata/escherichia_coli/genes/:geneId', {
      id: '@id',
      locus: '@locus',
      summary: '@description',
      intervalStart: '@seqIntervalStart',
      intervalStop: '@seqIntervalStop',
      protein: '@protein'
    }, {
      cache: true
    });
  });

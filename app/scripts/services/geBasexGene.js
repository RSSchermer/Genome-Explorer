'use strict';

angular.module('genomeExplorerApp')
  .factory('geBasexGene', function ($resource) {
    return $resource('http://localhost:9876/restxq/genedata/homo_sapiens/genes/:geneId', null, {
      cache: true
    });
  });

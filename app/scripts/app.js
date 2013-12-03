'use strict';

angular.module('genomeExplorerApp', [
  'restangular',
  'ngRoute'
])
  .constant('GENES_PER_PAGE', 15)
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/genes'
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
  })
  .config(function (RestangularProvider) {
    RestangularProvider
      .setBaseUrl('http://localhost:9876/restxq/genedata/homo_sapiens')
      .setDefaultHttpFields({cache: true})
      .setResponseExtractor(function(response, operation) {
        var newResponse;
        
        if (operation === 'getList') {
          newResponse = response.results;
          newResponse.metadata = {
            count: response.count
          };
        } else {
          newResponse = response.results;
        }
        
        return newResponse;
      })
      .addElementTransformer('genes', false, function(gene) {
        gene.addRestangularMethod('getExons', 'get', 'exons');
         
        return gene;
      });
  });

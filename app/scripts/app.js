'use strict';

angular.module('genomeExplorerApp', [
  'restangular',
  'ngRoute',
  'angularSpinner',
  'glider'
])
  .constant('GENEDATA_SERVER_PATH', 'http://localhost:9876/restxq/genedata/homo_sapiens')
  .constant('SEQUENCE_SERVER_PATH', 'http://localhost:9875/sequencedata/homo_sapiens/chromosome/')
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
        templateUrl: 'views/gene.html',
        controller: 'GeneCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function (RestangularProvider, GENEDATA_SERVER_PATH) {
    RestangularProvider
      .setBaseUrl(GENEDATA_SERVER_PATH)
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

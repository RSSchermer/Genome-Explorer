'use strict';

angular.module('genomeExplorerApp')
  .controller('MainCtrl', function ($scope, AngularTour) {
    var explorerTour = AngularTour.create();
    
    explorerTour.addSteps([
      {
        path: '/genes',
        element: '#tour-start',
        title: 'Welcome to the Genome Explorer',
        content: 'New to the genome explorer? You can follow this tour to learn about the main features. ' +
          'You can always end the tour by clicking "end tour" below and follow it at a later time should any ' +
          'of the functionality be unclear.',
        placement: 'bottom'
      },
      {
        path: '/genes',
        element: '#search-query-input',
        title: 'Search for genes',
        content: 'Enter (part of) a gene symbol, description or locus to in order to find a particular gene.',
        placement: 'bottom'
      },
      {
        path: '/genes',
        element: '#chromosome-filter',
        title: 'Chromosome filter',
        content: 'You can select one of the chromosomes from this dropdown. This will filter the genes in the ' +
          'search results and only show genes that lie on that particular chromosome.',
        placement: 'bottom'
      },
      {
        path: '/genes',
        element: '#gene-type-filter',
        title: 'Chromosome filter',
        content: 'In the same way you can filter genes for a particular chromosome, you can also filter genes ' +
          'by gene type. There are several different types of genes you can filter for.',
        placement: 'bottom'
      },
      {
        path: '/genes',
        element: '#gene-list-table',
        title: 'Search results',
        content: 'The genes that match your query and filters are displayed here. Results may have been divided ' +
          'over multiple pages. Click on a gene\'s symbol to view more detailed information about a gene.',
        placement: 'top'
      },
      {
        path: '/genes/ACADM',
        element: '#gene-profile-title',
        title: 'Gene description',
        content: 'This page provides more information about one particular gene. It will be shown after you ' +
          'click on a gene\'s symbol on the search page. In this case information for the "ACADM" gene is shown.',
        placement: 'top'
      },
      {
        path: '/genes/ACADM',
        element: '#gene-diagram-zoom-slider',
        title: 'Gene description',
        content: 'The diagram below shows the genes sequence and the exon distribution. This slider can be used ' +
          'to zoom out, giving a better overview of the position of the exons.',
        placement: 'top'
      }
    ]);
    
    $scope.$on('readyForTour', function () {
      explorerTour.start();
    });
    
    $scope.startTour = function () {
      explorerTour.end();
      explorerTour.restart();
      explorerTour.start(true);
    };
  });

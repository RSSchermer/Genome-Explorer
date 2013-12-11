'use strict';

angular.module('genomeExplorerApp')
  .directive('geneSequenceDiagram', function (d3Loader, $window, $timeout) {
    return {
      restrict: 'E',
      scope: {
        gene: '=',
        plusSequence: '=',
        zoom: '='
      },
      link: function (scope, element, attrs) {
        var renderTimeout;
        var plusSequence;
        var minusSequence;
        var minDiagramWidth;
        var maxDiagramWidth;
        var sequenceInverseMap = {
            A: 'T',
            T: 'A',
            C: 'G',
            G: 'C'
          };
        
        var exonColor = attrs.exonColor || '#AAA';
        var plusStrandColor = attrs.plusStrandColor || '#EB2F32';
        var minusStrandColor = attrs.minusStrandColor || '#3C36EB';
        
        d3Loader.load().then(function (d3) {
          var svg = d3.select(element[0]).append('svg');
          
          window.onresize = function() {
            scope.$apply();
          };
          
          scope.$watch(function() {
            return angular.element($window)[0].innerWidth;
          }, function() {
            minDiagramWidth = null;
            
            scope.render(scope.gene, plusSequence, minusSequence, scope.zoom);
          });
          
          scope.$watch('gene', function(gene) {
            scope.render(gene, plusSequence, minusSequence, scope.zoom);
          }, true);
          
          scope.$watch('plusSequence', function(sequence) {
            if (sequence) {
              plusSequence = sequence;
              minusSequence = sequence.replace(/A|T|C|G/g, function (match) {
                return sequenceInverseMap[match] || match;
              });
              
              maxDiagramWidth = null;
              
              scope.render(scope.gene, plusSequence, minusSequence, scope.zoom);
            }
          });
          
          scope.$watch('zoom', function(zoom) {
            scope.render(scope.gene, plusSequence, minusSequence, zoom);
          });
          
          scope.render = function(gene, plusSequence, minusSequence, zoom) {
            if (!gene || !plusSequence || !minusSequence) {
              return;
            }
            
            if (!gene.intervalStart || !gene.intervalStop || !gene.exons) {
              return;
            }
            
            if (renderTimeout) {
              clearTimeout(renderTimeout);
            }
            
            renderTimeout = $timeout(function() {
              zoom = zoom === null || zoom === undefined ? 1 : Math.pow(zoom, 6);
              
              var geneIntervalStart = parseInt(gene.intervalStart);
              var geneIntervalStop = parseInt(gene.intervalStop);
              var geneIntervalLength = geneIntervalStop - geneIntervalStart;
              
              svg.selectAll('*').remove();
              
              svg.style('height', '90px');
              
              var exonRectGroup = svg.append('g');
              
              var sequenceText = svg.append('text')
                .text(plusSequence)
                .attr('font-family', 'monospace')
                .attr('font-size', 20)
                .attr('fill', plusStrandColor)
                .attr('y', 40);
              
              sequenceText.append('svg:title')
                .text('Plus strand');
              
              if (!minDiagramWidth) {
                svg.style('width', '100%');
                
                minDiagramWidth = svg.node().parentNode.offsetWidth;
              }
              
              if (!maxDiagramWidth) {
                maxDiagramWidth = sequenceText.node().getComputedTextLength();
              }
              
              var svgWidth = minDiagramWidth + (maxDiagramWidth - minDiagramWidth) * zoom;
              
              svg.style('width', svgWidth +'px');
              
              if (Number(zoom) === 1) {
                svg.append('text')
                  .text(minusSequence)
                  .attr('font-family', 'monospace')
                  .attr('font-size', 20)
                  .attr('fill', minusStrandColor)
                  .attr('y', 63)
                  .append('svg:title')
                  .text('Minus strand');
              } else {
                sequenceText.remove();
              }
              
              svg.append('line')
                .attr('y1', 20)
                .attr('y2', 20)
                .attr('x1', 0)
                .attr('x2', svgWidth)
                .attr('stroke-width', 5)
                .attr('stroke', plusStrandColor);
              
              svg.append('line')
                .attr('y1', 70)
                .attr('y2', 70)
                .attr('x1', 0)
                .attr('x2', svgWidth)
                .attr('stroke-width', 5)
                .attr('stroke', minusStrandColor);
              
              svg.append('rect')
                .attr('height', 14)
                .attr('width', 24)
                .attr('y', 1)
                .attr('x', 0)
                .attr('fill', plusStrandColor)
                .append('svg:title')
                .text('Legend');
              
              svg.append('text')
                .text('Plus Strand')
                .attr('font-family', 'sans-serif')
                .attr('font-size', 12)
                .attr('fill', plusStrandColor)
                .attr('font-weight', 'bold')
                .attr('y', 13)
                .attr('x', 29)
                .append('svg:title')
                .text('Legend');
              
              svg.append('rect')
                .attr('height', 14)
                .attr('width', 24)
                .attr('y', 1)
                .attr('x', 110)
                .attr('fill', minusStrandColor)
                .append('svg:title')
                .text('Legend');
              
              svg.append('text')
                .text('Minus Strand')
                .attr('font-family', 'sans-serif')
                .attr('font-size', 12)
                .attr('fill', minusStrandColor)
                .attr('font-weight', 'bold')
                .attr('y', 13)
                .attr('x', 139)
                .append('svg:title')
                .text('Legend');
              
              svg.append('rect')
                .attr('height', 14)
                .attr('width', 24)
                .attr('y', 1)
                .attr('x', 230)
                .attr('fill', exonColor)
                .append('svg:title')
                .text('Legend');
              
              svg.append('text')
                .text('Exon')
                .attr('font-family', 'sans-serif')
                .attr('font-size', 12)
                .attr('fill', exonColor)
                .attr('font-weight', 'bold')
                .attr('y', 13)
                .attr('x', 259)
                .append('svg:title')
                .text('Legend');
                
              exonRectGroup.selectAll('rect')
                .data(gene.exons).enter()
                .append('rect')
                .attr('height', 23)
                .attr('width', function (exon) {
                  return Math.ceil((parseInt(exon.intervalStop) - parseInt(exon.intervalStart)) /
                    geneIntervalLength * svgWidth);
                })
                .attr('y', function (exon) {
                  if (exon.strand === 'plus') {
                    return 22;
                  } else {
                    return 45;
                  }
                })
                .attr('x', function (exon) {
                  return (parseInt(exon.intervalStart) - geneIntervalStart) /
                    geneIntervalLength * svgWidth;
                })
                .attr('fill', exonColor)
                .attr('title', 'Exon')
                .append('svg:title')
                .text(function (exon) {
                  return 'Exon - '+ exon.product;
                });
              
            }, 300);
          };
        });
      }
    };
  });

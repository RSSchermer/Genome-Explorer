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
        
        var rnaExonColor = attrs.ranExonColor || '#CCC';
        var peptideExonColor = attrs.petideExonColor || '#999';
        
        d3Loader.load().then(function (d3) {
          var svg = d3.select(element[0])
                      .append('svg');
          
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
              var geneIntervalStop = parseInt(gene.intervalStop) + 1;
              var geneIntervalLength = geneIntervalStop - geneIntervalStart;
              
              svg.selectAll('*').remove();
              
              svg.style('height', '90px');
              
              var exonRectGroup = svg.append('g');
              
              var sequenceText = svg.append('text')
                .text(plusSequence)
                .attr('font-family', 'monospace')
                .attr('font-size', 20)
                .attr('fill', 'red')
                .attr('y', 40);
              
              if (!minDiagramWidth) {
                svg.style('width', '100%');
                
                minDiagramWidth = svg.node().offsetWidth;
              }
              
              if (!maxDiagramWidth) {
                maxDiagramWidth = sequenceText.node().getComputedTextLength();
              }
              
              svg.style('width', minDiagramWidth + (maxDiagramWidth - minDiagramWidth) * zoom +'px');
                      
              console.log(plusSequence.length +' '+ geneIntervalLength);
              
              if (Number(zoom) === 1) {
                svg.append('text')
                  .text(minusSequence)
                  .attr('font-family', 'monospace')
                  .attr('font-size', 20)
                  .attr('fill', 'blue')
                  .attr('y', 63);
              } else {
                sequenceText.remove();
              }
              
              svg.append('line')
                .attr('y1', 20)
                .attr('y2', 20)
                .attr('x1', 0)
                .attr('x2', svg.node().offsetWidth)
                .attr('stroke-width', 5)
                .attr('stroke', 'red');
              
              svg.append('line')
                .attr('y1', 70)
                .attr('y2', 70)
                .attr('x1', 0)
                .attr('x2', svg.node().offsetWidth)
                .attr('stroke-width', 5)
                .attr('stroke', 'blue');
              
              svg.append('text')
                .text('Plus strand')
                .attr('font-family', 'sans-serif')
                .attr('font-size', 15)
                .attr('font-weight', 'bold')
                .attr('fill', 'red')
                .attr('y', 12)
                .attr('x', 3);
              
              svg.append('text')
                .text('Minus strand')
                .attr('font-family', 'sans-serif')
                .attr('font-size', 15)
                .attr('font-weight', 'bold')
                .attr('fill', 'blue')
                .attr('y', 89)
                .attr('x', 3);
              
              exonRectGroup.selectAll('rect')
                .data(gene.exons).enter()
                .append('rect')
                .attr('height', 23)
                .attr('width', function (exon) {
                  return Math.ceil((parseInt(exon.intervalStop) - parseInt(exon.intervalStart)) /
                    geneIntervalLength * svg.node().offsetWidth);
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
                    geneIntervalLength * svg.node().offsetWidth;
                })
                .attr('fill', function (exon) {
                  return exon.product === 'peptide' ? peptideExonColor : rnaExonColor;
                })
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

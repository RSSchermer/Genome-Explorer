'use strict';

angular.module('genomeExplorerApp')
  .factory('d3Loader', function ($document, $q, $rootScope) {
    var d = $q.defer();
    
    var onScriptLoad = function () {
      $rootScope.$apply(function() { d.resolve(window.d3); });
    };
    
    var scriptTag = $document[0].createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = 'bower_components/d3/d3.min.js';
    scriptTag.onreadystatechange = function () {
      if (this.readyState === 'complete'){
        onScriptLoad();
      }
    };
    scriptTag.onload = onScriptLoad;

    var body = $document[0].getElementsByTagName('body')[0];
    body.appendChild(scriptTag);

    return {
      load: function() { return d.promise; }
    };
  });

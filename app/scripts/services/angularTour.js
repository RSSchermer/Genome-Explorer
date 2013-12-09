'use strict';

angular.module('genomeExplorerApp')
  .factory('AngularTour', function Tour($window, $location, $rootScope) {
    if (!$window.Tour) {
      throw new Error('Could not find object "Tour" on the window. ' +
        'Please include bootstrap-tour.js before initializing angular.');
    }
    
    var AngularTour = angular.copy($window.Tour);
    
    AngularTour.prototype._isRedirect = function(path) {
      return path !== null && path !== '' && path.replace(/\?.*$/, '').replace(/\/?$/, '') !== $location.path();
    };

    AngularTour.prototype._redirect = function(step, path) {
      if (angular.isFunction(step.redirect)) {
        return step.redirect.call(this, path);
      } else if (step.redirect === true) {
        this._debug('Redirect to ' + path);
        this._inited = false;
        
        $rootScope.$apply($location.url(path));
        
        return true;
      }
    };
    
    return {
      create: function (options) {
        return new AngularTour(options);
      }
    };
  });

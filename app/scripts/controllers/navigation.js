'use strict';

angular.module('genomeExplorerApp')
  .controller('NavigationCtrl', function ($scope, $location) {
    $scope.isCurrentPath = function (path) {
      return $location.path() === path;
    };
  });

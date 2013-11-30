'use strict';

describe('Controller: GenesCtrl', function () {

  // load the controller's module
  beforeEach(module('genomeExplorerApp'));

  var GenesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GenesCtrl = $controller('GenesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

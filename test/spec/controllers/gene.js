'use strict';

describe('Controller: GeneCtrl', function () {

  // load the controller's module
  beforeEach(module('genomeExplorerApp'));

  var GeneCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GeneCtrl = $controller('GeneCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

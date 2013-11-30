'use strict';

describe('Service: Gebasexgene', function () {

  // load the service's module
  beforeEach(module('genomeExplorerApp'));

  // instantiate service
  var Gebasexgene;
  beforeEach(inject(function (_Gebasexgene_) {
    Gebasexgene = _Gebasexgene_;
  }));

  it('should do something', function () {
    expect(!!Gebasexgene).toBe(true);
  });

});

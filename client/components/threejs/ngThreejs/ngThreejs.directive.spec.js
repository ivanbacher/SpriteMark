'use strict';

describe('Directive: ngThreejs', function () {

  // load the directive's module
  beforeEach(module('bunnyMarkApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ng-threejs></ng-threejs>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ngThreejs directive');
  }));
});
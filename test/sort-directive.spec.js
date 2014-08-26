var expect = require('chai').expect;
var sortModule = require('../lib/sort')(angular);
var sinon = require('sinon');
var ngModule = angular.mock.module;

describe('sort', function() {
  var scope;
  var compileElement;

  beforeEach(ngModule('ub-sort'));

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    compileElement = function(html) {
      return $compile(html)(scope);
    };
  }));

  it('adds "sortable" class to the element', function() {
    var ele = compileElement("<div ub-sort='foo'></div>");
    expect(ele.hasClass('sortable')).to.be.true;
  });

});

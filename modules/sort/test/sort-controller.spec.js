var expect = require('chai').expect;
var SortController = require('../sort-controller.js');
var SortService = require('../sort-service.js');

describe('SortController', function() {
  var $scope;
  var $attrs;
  var $parse;
  var service;
  var controller;
  var sortKey = 'foo';

  beforeEach(inject(function($rootScope, _$parse_) {
    $scope = $rootScope.$new();
    $attrs = { sort: sortKey };
    $parse = _$parse_;
    service = new SortService();
    controller = function() {
      return new SortController($scope, $attrs, $parse, service);
    }
  }));

  it('expects $scope, $attrs, $parse and nubSortSevice to be injected', function() {
    expect(SortController).to.have.property('$inject');
    expect(SortController.$inject).to.eql(['$scope', '$attrs', '$parse', 'nubSortService']);
  });

  it('has an instance property called states', function() {
    var states = controller().states;
    expect(states.none).to.equal('');
    expect(states.ascending).to.equal('asc');
    expect(states.descending).to.equal('desc');
  });

  describe('#sortBy()', function() {
    it('updates the sort state', function() {
      controller().sortBy('bar', false);
      expect(service.state[sortKey].predicate).to.equal('bar');
      expect(service.state[sortKey].reverse).to.be.false;
    });

    it('calls onSortBy callback on scope when provided', function() {
      var called = false;

      $attrs.onSortBy = 'onSort';

      $scope.onSort = function(key, predicate, reverse) {
        expect(key).to.equal(sortKey);
        expect(predicate).to.equal('bar');
        expect(reverse).to.be.false;
        called = true;
      };

      controller().sortBy('bar', false);
      expect(called).to.be.true;
    });

    it('broadcasts an "nub:sort" event when called', function() {
      var childScope = $scope.$new();
      var called = false;
      childScope.$on('nub:sort', function(evt, data) {
        expect(data.predicate).to.equal('bar');
        called = true;
      });
      controller().sortBy('bar', false);
      expect(called).to.be.true;
    });
  });
});

var expect = require('chai').expect;
var SortController = require('../sort-controller.js');
var SortService = require('../sort-service.js');
var sinon = require('sinon');

describe('SortController', function() {
  var $scope;
  var $attrs;
  var $parse;
  var service;
  var controller;
  var sortKey = 'foo';

  beforeEach(inject(function($rootScope, _$parse_) {
    $scope = $rootScope.$new();
    $attrs = { nubSort: sortKey };
    $parse = _$parse_;
    service = new SortService();
    controller = function() {
      return new SortController($scope, $attrs, $parse, service);
    };
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
      var onSort = sinon.spy();
      $attrs.onSortBy = 'onSort';
      $scope.onSort = onSort;

      controller().sortBy('bar', false);

      expect(onSort.called).to.be.true;
      expect(onSort.calledWith(sortKey, 'bar', false));
    });

    it('broadcasts an "nub:sort" event when called', function() {
      var handler = sinon.spy();
      $scope.$new().$on('nub:sort', handler);

      controller().sortBy('bar', false);

      expect(handler.called).to.be.true;
      expect(handler.firstCall.args[1]).to.eql({ predicate: 'bar' });
    });
  });
});

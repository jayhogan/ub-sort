var expect = require('chai').expect;
var sortByFilter = require('../sort-by');

describe('sortBy', function() {
  var sortService;
  var sortBy;
  var key = 'sortKey';
  var a = { letter: 'a' };
  var b = { letter: 'b' };
  var c = { letter: 'c' };

  beforeEach(inject(function($filter) {
    sortService = { state: {} };
    sortBy = sortByFilter($filter, sortService);
  }));

  it('expects "$filter" and "nubSortService" to be injected', function() {
    expect(sortByFilter).to.have.property('$inject');
    expect(sortByFilter.$inject).to.eql(['$filter', 'nubSortService']);
  });

  it('will return unsorted array if sort not specified', function() {
    expect(sortBy([b, c, a], key)).to.eql([b, c, a]);
  });

  it('will return unsorted array if predicate not specified', function() {
    sortService.state[key] = {};
    expect(sortBy([b, c, a], key)).to.eql([b, c, a]);
  });

  it('will return unsorted array if invalid predicate is specified', function() {
    sortService.state[key] = { predicate: 'bar' };
    expect(sortBy([b, c, a], key)).to.eql([b, c, a]);
  });

  it('will perform ascending sort if reverse is not specified', function() {
    sortService.state[key] = { predicate: 'letter' };
    expect(sortBy([b, c, a], key)).to.eql([a, b, c]);
  });

  it('will perform ascending sort if reverse is false', function() {
    sortService.state[key] = { predicate: 'letter', reverse: false };
    expect(sortBy([b, c, a], key)).to.eql([a, b, c]);
  });

  it('will perform descending sort if reverse is true', function() {
    sortService.state[key] = { predicate: 'letter', reverse: true };
    expect(sortBy([b, c, a], key)).to.eql([c, b, a]);
  });
});
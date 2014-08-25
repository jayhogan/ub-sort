var expect = require('chai').expect;
var SortService = require('../sort-service.js');

describe('sortService', function() {
  var service;

  beforeEach(function() {
    service = new SortService();
  });

  describe('#state', function() {
    it('is a property', function() {
      expect(service).to.have.property('state');
    });

    it('is initially empty', function() {
      expect(service.state).to.be.empty;
    });
  });

  describe('#updateSortState()', function() {
    it('is a function', function() {
      expect(service.updateSortState).to.be.a('function');
    });

    it('adds a key to the state property', function() {
      service.updateSortState('foo', 'bar', true);
      expect(service.state.foo).to.be.defined;
    });

    it('updates an existing key on the state property', function() {
      service.state.foo = {};
      service.updateSortState('foo', 'bar');
      expect(service.state.foo.predicate).to.equal('bar');
      expect(service.state.foo.reverse).to.be.false;
    });

    it('only sets reverse to true when passed "true"', function() {
      service.updateSortState('foo', 'bar', 'true');
      expect(service.state.foo.reverse).to.be.false;

      service.updateSortState('foo', 'bar', '1');
      expect(service.state.foo.reverse).to.be.false;

      service.updateSortState('foo', 'bar', true);
      expect(service.state.foo.reverse).to.be.true;
    });
  });
});
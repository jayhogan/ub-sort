var expect = require('chai').expect;
var sortModule = require('../sort')(angular);
var sinon = require('sinon');
var ngModule = angular.mock.module;

describe('sort-col', function() {
  var scope;
  var compileElement;
  var people = [];
  var html = "<table nub-sort='foo'>"
           + "  <thead><tr>"
           + "    <th nub-sort-col='first'>First</th>"
           + "    <th nub-sort-col='last'>Last</th>"
           + "  </tr></thead>"
           + "  <tbody><tr ng-repeat=\"person in people | nubSortBy:'foo'\">"
           + "    <td>{{ person.first }}</td>"
           + "    <td>{{ person.last }}</td>"
           + "  </tr></tbody>"
           + "</table>";
  var altHtml = "<table nub-sort='foo'>"
           + "  <thead><tr>"
           + "    <th nub-sort-col='first' sort-initial='asc'>First</th>"
           + "    <th nub-sort-col='lastByLength'>Last</th>"
           + "  </tr></thead>"
           + "  <tbody><tr ng-repeat=\"person in people | nubSortBy:'foo'\">"
           + "    <td>{{ person.first }}</td>"
           + "    <td>{{ person.last }}</td>"
           + "  </tr></tbody>"
           + "</table>";

  beforeEach(ngModule('ng-utility-belt.sort'));

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.people = people;
    compileElement = function(html) {
      return $compile(html)(scope);
    };
  }));

  afterEach(function() {
    people = [];
  })

  it('adds "sort-col" class to the element', function() {
    var ele = compileElement(html);
    var tableHeaders = ele.find('th');
    expect(tableHeaders.hasClass('sort-col')).to.be.true;
  });

  it('initial click of sortable element sorts in ascending order', function() {
    var ele = compileElement(html);
    var lastNameHeader = ele.find('th').eq(1);
    addPerson('Mary', 'Smith');
    addPerson('Paul', 'Jones');
    scope.$apply();

    lastNameHeader.triggerHandler('click');

    expect(lastNameHeader.hasClass('asc')).to.be.true;

    var results = thePeople(ele);
    expect(results[0].last).to.equal('Jones');
    expect(results[1].last).to.equal('Smith');
  });

  it('second click of sortable element sorts in descending order', function() {
    var ele = compileElement(html);
    var lastNameHeader = ele.find('th').eq(1);
    addPerson('Mary', 'Smith');
    addPerson('Paul', 'Jones');
    scope.$apply();

    lastNameHeader.triggerHandler('click');
    expect(lastNameHeader.hasClass('asc')).to.be.true;

    lastNameHeader.triggerHandler('click');
    expect(lastNameHeader.hasClass('asc')).to.be.false;
    expect(lastNameHeader.hasClass('desc')).to.be.true;

    var results = thePeople(ele);
    expect(results[0].last).to.equal('Smith');
    expect(results[1].last).to.equal('Jones');
  });

  it('clicking sortable element removes sort from other elements in same scope', function() {
    var ele = compileElement(html);
    var firstNameHeader = ele.find('th').eq(0);
    var lastNameHeader = ele.find('th').eq(1);
    addPerson('Mary', 'Smith');
    addPerson('Paul', 'Jones');
    scope.$apply();

    lastNameHeader.triggerHandler('click');
    expect(lastNameHeader.hasClass('asc')).to.be.true;

    firstNameHeader.triggerHandler('click');
    expect(lastNameHeader.hasClass('asc')).to.be.false;
    expect(firstNameHeader.hasClass('asc')).to.be.true;

    var results = thePeople(ele);
    expect(results[0].first).to.equal('Mary');
    expect(results[1].first).to.equal('Paul');
  });

  it('applys an initial sort', function() {
    var ele = compileElement(altHtml);
    var firstNameHeader = ele.find('th').eq(0);
    addPerson('Paul', 'Jones');
    addPerson('Mary', 'Smith');
    scope.$apply();

    expect(firstNameHeader.hasClass('asc')).to.be.true;

    var results = thePeople(ele);
    expect(results[0].first).to.equal('Mary');
    expect(results[1].first).to.equal('Paul');
  });

  it('supports sorting by predicate function attached to scope', function() {
    scope.lastByLength = function(person) {
      return person.last.length;
    };

    var ele = compileElement(altHtml);
    var lastNameHeader = ele.find('th').eq(1);
    addPerson('Mary', 'Higgenbotham');
    addPerson('Paul', 'Jones');
    scope.$apply();

    lastNameHeader.triggerHandler('click');

    expect(lastNameHeader.hasClass('asc')).to.be.true;

    var results = thePeople(ele);
    expect(results[0].last).to.equal('Jones');
    expect(results[1].last).to.equal('Higgenbotham');
  });

  function addPerson(first, last) {
    people.push({ first: first, last: last });
  }

  function thePeople(ele) {
    var results = [];
    var rows = ele.find('tbody').find('tr');
    for (var i = 0; i < rows.length; i++) {
      var tds = rows.eq(i).find('td');
      results.push({ first: tds.eq(0).text(), last: tds.eq(1).text() });
    }
    return results;
  }
});

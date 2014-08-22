'use strict';

var angular = require('angular');
var moduleName = 'ng-utility-belt.sort';

var sortModule = angular.module(moduleName, [])
  .service(   'nubSortService',     require('./sort-service'))
  .filter(    'nubSortBy',          require('./sort-by'))
  .controller('NubSortController',  require('./sort-controller'))
  .directive( 'nubSort',            require('./sort-directive'))
  .directive( 'nubSortCol',         require('./sort-col-directive'));

module.exports = {
  name: moduleName,
  value: sortModule
};

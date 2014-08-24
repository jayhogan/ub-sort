'use strict';

function defineModule(angular) {
  return angular.module('ng-utility-belt.sort', [])
    .service(   'nubSortService',     require('./sort-service'))
    .filter(    'nubSortBy',          require('./sort-by'))
    .controller('NubSortController',  require('./sort-controller'))
    .directive( 'nubSort',            require('./sort-directive'))
    .directive( 'nubSortCol',         require('./sort-col-directive'));
}

module.exports = defineModule;

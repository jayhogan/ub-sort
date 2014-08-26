'use strict';

var SortController = require('./sort-controller')();

/**
 * @ngdoc directive
 * @name ubSort
 * @restrict A
 *
 * @description
 * This directive acts as an orchestrator for sorting.
 *
 * @param onSortBy {expression} Callback
 */
function sort() {
  return {
    restrict: 'A',
    controller: SortController,
    link: function (scope, element, attr, ctrl) {
      // TODO - Make this class configurable
      element.addClass('sortable');
    }
  };
}

module.exports = function(module) {
  if (module) {
    module.directive('ubSort', sort);
  }
  return sort;
}

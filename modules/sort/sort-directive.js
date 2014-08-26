'use strict';

/**
 * @ngdoc directive
 * @name sort
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
    controller: 'NubSortController',
    link: function (scope, element, attr, ctrl) {
      element.addClass('sortable');
    }
  };
}

module.exports = sort;

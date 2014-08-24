'use strict';

/**
 * @ngdoc filter
 * @name sortBy
 * @kind function
 *
 * @description
 * Fetches the sort state for the given sortTable and delegates to the native
 * Angular orderBy filter.
 *
 * @param {Array} array The array to sort.
 * @param {String} key Sort identification
 *
 * @returns {Array} Sorted copy of the source array.
 */
function sortByFilter($filter, nubSortService) {
  return function(array, key) {
    var sortState = nubSortService.state[key];
    if (sortState && sortState.predicate) {
      return $filter('orderBy')(array, sortState.predicate, sortState.reverse);
    }
    return array;
  };
}

sortByFilter.$inject = ['$filter', 'nubSortService'];

module.exports = sortByFilter;

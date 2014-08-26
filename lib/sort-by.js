'use strict';

/**
 * @ngdoc filter
 * @name ubSortBy
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
function sortByFilter($filter, ubSortService) {
  return function(array, key) {
    var sortState = ubSortService.state[key];
    if (sortState && sortState.predicate) {
      return $filter('orderBy')(array, sortState.predicate, sortState.reverse);
    }
    return array;
  };
}

sortByFilter.$inject = ['$filter', 'ubSortService'];

module.exports = function(module) {
  if (module) {
    module.filter('ubSortBy', sortByFilter);
  }
  return sortByFilter;
}

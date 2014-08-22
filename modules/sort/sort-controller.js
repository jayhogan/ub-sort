'use strict';

/**
 * @ngdoc controller
 * @name SortTableController
 * 
 * @description
 * Controller used by the sortTable directive
 */
function SortController($scope, $attrs, $parse, nubSortService) {
  var key = $attrs.sortTable;
  var onSortBy = function() {};

  if ($attrs.onSortBy) {
    onSortBy = $parse($attrs.onSortBy)($scope);
  }

  // TODO - Configurable by provider?
  this.states = {
    none: '',
    ascending: 'asc',
    descending: 'desc'
  };

  this.sortBy = function sortBy(predicate, reverse) {
    nubSortService.updateSortState(key, predicate, reverse);
    onSortBy(key, predicate, reverse);
    $scope.$broadcast('nub:sort', {predicate: predicate});
  };
}

module.exports = SortController;
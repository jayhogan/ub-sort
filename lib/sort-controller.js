'use strict';

/**
 * @ngdoc controller
 * @name ubSortController
 * 
 * @description
 * Controller used by the sortTable directive
 */
function SortController($scope, $attrs, $parse, ubSortService) {
  var key = $attrs.ubSort;
  var onSortBy = function() {};

  if ($attrs.onSortBy) {
    onSortBy = $parse($attrs.onSortBy)($scope);
  }

  // TODO - Make the state classes configurable
  this.states = {
    none: '',
    ascending: 'asc',
    descending: 'desc'
  };

  this.sortBy = function sortBy(predicate, reverse) {
    ubSortService.updateSortState(key, predicate, reverse);
    onSortBy(key, predicate, reverse);
    $scope.$broadcast('ub:sort', {predicate: predicate});
  };
}

SortController.$inject = ['$scope', '$attrs', '$parse', 'ubSortService'];

module.exports = function(module) {
  if (module) {
    module.controller('ubSortController', SortController);
  }
  return SortController;
}

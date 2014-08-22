'use strict';

/* Sort module */
angular.module('ng-utility-belt.sort', [])

/**
 * @ngdoc factory
 * @name nubSortService
 * @kind function
 *
 * @description
 * Holds and manages state for sorting directives.
 */
.factory('nubSortService', [function() {
  var sortTables = {};
  return {
    getState: function(key) {
      return sortTables[key];
    },

    updateSortState: function(key, predicate, reverse) {
      sortTables[key] = sortTables[key] || {};
      sortTables[key].predicate = predicate;
      sortTables[key].reverse = reverse === true;
    }
  }
}])

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
.filter('nubSort',['$filter', 'nubSortService', function($filter, nubSortService) {
  return function(array, sortTableKey) {
    var sortState = nubSortService.getState(sortTableKey);
    if (sortState && sortState.predicate) {
      return $filter('orderBy')(array, sortState.predicate, sortState.reverse);
    }
    return array;
  };
}])

/**
 * @ngdoc controller
 * @name SortTableController
 * 
 * @description
 * Controller used by the sortTable directive
 */
.controller('NubSortController', ['$scope', '$attrs', 'nubSortService', '$parse', function($scope, $attrs, nubSortService, $parse) {
  var key = $attrs.sortTable;
  var onSortBy = angular.noop;

  if ($attrs.onSortBy) {
    onSortBy = $parse($attrs.onSortBy)($scope);
  }

  this.states = {
    none: '',
    ascending: 'asc',
    descending: 'desc'
  };

  this.sortBy = function sortBy(predicate, reverse) {
    nubSortService.updateSortState(key, predicate, reverse);
    onSortBy(key, predicate, reverse);
    $scope.$broadcast('sort:sort', {predicate: predicate});
  };
}])

/**
 * @ngdoc directive
 * @name sortTable
 * @restrict A
 *
 * @description
 * This directive acts as an orchestrator for sorting.
 *
 * @param onSortBy {expression} Callback
 */
.directive('nubSort', [function() {
  return {
    restrict: 'A',
    controller: 'NubSortController',
    link: function (scope, element, attr, ctrl) {
      element.addClass('sortable');
    }
  };
}])

/**
 * @ngdoc directive
 * @name sortColumn
 * @restrict A
 *
 * @description
 * Decorates the element with a click handler to control sorting.
 *
 * @param sortInitial {ascending|descending} Determines if this column should be sorted when the view is loaded
 */
.directive('nubSortCol', ['$parse', function($parse) {
  return {
    restrict: 'A',
    require: '^nubSort',
    link: function(scope, element, attr, ctrl) {
      var states = ctrl.states;
      var state = states.none;
      var predicate = attr.sortColumn;
      var parsedPredicate = $parse(predicate);

      if (angular.isFunction(parsedPredicate(scope))) {
        predicate = parsedPredicate(scope);
      }

      if (attr.sortInitial) {
        state = states[attr.sortInitial] || states.ascending;
        applySort();
      }

      element.addClass('sort-col');

      element.bind('click', function() {
        if (predicate) {
          scope.$apply(function () {
            state = state === states.none || state === states.descending ? states.ascending : states.descending;
            applySort();
          });
        }
      });

      scope.$on('sort:sort', function (event, args) {
        if (args.predicate !== predicate) {
          state = states.none;
          element.removeClass('asc').removeClass('desc');
        }
      });

      function applySort() {
        ctrl.sortBy(predicate, state === states.descending);
        element
          .removeClass(states.ascending)
          .removeClass(states.descending)
          .addClass(state);
      }
    }
  };
}]);

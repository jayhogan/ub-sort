'use strict';

/**
 * @ngdoc directive
 * @name ubSortCol
 * @restrict A
 *
 * @description
 * Decorates the element with a click handler to control sorting.
 *
 * @param sortInitial {ascending|descending} Determines if this column should be sorted when the view is loaded
 */
function sortCol($parse) {
  return {
    restrict: 'A',
    require: '^ubSort',
    link: function(scope, element, attr, ctrl) {
      var states = ctrl.states;
      var state = states.none;
      var predicate = attr.ubSortCol;
      var parsedPredicate = $parse(predicate);

      if (angular.isFunction(parsedPredicate(scope))) {
        predicate = parsedPredicate(scope);
      }

      if (attr.sortInitial) {
        state = states[attr.sortInitial] || states.ascending;
        applySort();
      }

      // TODO - Make this class configurable
      element.addClass('sort-col');

      element.bind('click', function() {
        if (predicate) {
          scope.$apply(function () {
            state = state === states.none || state === states.descending ? states.ascending : states.descending;
            applySort();
          });
        }
      });

      scope.$on('ub:sort', function (event, args) {
        if (args.predicate !== predicate) {
          state = states.none;
          element.removeClass(states.ascending).removeClass(states.descending);
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
}

sortCol.$inject = ['$parse'];

module.exports = function(module) {
  if (module) {
    module.directive('ubSortCol', sortCol);
  }
  return sortCol;
}

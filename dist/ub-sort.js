!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ubSort=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./lib/sort')(window.angular);

},{"./lib/sort":7}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./sort-controller":4}],6:[function(require,module,exports){
'use strict';

/**
 * @ngdoc service
 * @name ubSortService
 * @kind function
 *
 * @description
 * Holds and manages state for sorting directives.
 */
function SortService() {
  this.state = {};
}

SortService.prototype.updateSortState = function(key, predicate, reverse) {
  this.state[key] = this.state[key] || {};
  this.state[key].predicate = predicate;
  this.state[key].reverse = reverse === true;
};

module.exports = function(module) {
  if (module) {
    module.service('ubSortService', SortService);
  }
  return SortService;
}

},{}],7:[function(require,module,exports){
'use strict';

function defineModule(angular) {
  var module = angular.module('ub-sort', []);

  require('./sort-service')(module);
  require('./sort-by')(module);
  require('./sort-controller')(module);
  require('./sort-directive')(module);
  require('./sort-col-directive')(module);

  return module;
}

module.exports = defineModule;

},{"./sort-by":2,"./sort-col-directive":3,"./sort-controller":4,"./sort-directive":5,"./sort-service":6}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qaG9nYW4vZGV2L3ViLXNvcnQvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4vYnJvd3Nlci5qcyIsIi9Vc2Vycy9qaG9nYW4vZGV2L3ViLXNvcnQvbGliL3NvcnQtYnkuanMiLCIvVXNlcnMvamhvZ2FuL2Rldi91Yi1zb3J0L2xpYi9zb3J0LWNvbC1kaXJlY3RpdmUuanMiLCIvVXNlcnMvamhvZ2FuL2Rldi91Yi1zb3J0L2xpYi9zb3J0LWNvbnRyb2xsZXIuanMiLCIvVXNlcnMvamhvZ2FuL2Rldi91Yi1zb3J0L2xpYi9zb3J0LWRpcmVjdGl2ZS5qcyIsIi9Vc2Vycy9qaG9nYW4vZGV2L3ViLXNvcnQvbGliL3NvcnQtc2VydmljZS5qcyIsIi9Vc2Vycy9qaG9nYW4vZGV2L3ViLXNvcnQvbGliL3NvcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuL2xpYi9zb3J0Jykod2luZG93LmFuZ3VsYXIpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBuZ2RvYyBmaWx0ZXJcbiAqIEBuYW1lIHViU29ydEJ5XG4gKiBAa2luZCBmdW5jdGlvblxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogRmV0Y2hlcyB0aGUgc29ydCBzdGF0ZSBmb3IgdGhlIGdpdmVuIHNvcnRUYWJsZSBhbmQgZGVsZWdhdGVzIHRvIHRoZSBuYXRpdmVcbiAqIEFuZ3VsYXIgb3JkZXJCeSBmaWx0ZXIuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNvcnQuXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5IFNvcnQgaWRlbnRpZmljYXRpb25cbiAqXG4gKiBAcmV0dXJucyB7QXJyYXl9IFNvcnRlZCBjb3B5IG9mIHRoZSBzb3VyY2UgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIHNvcnRCeUZpbHRlcigkZmlsdGVyLCB1YlNvcnRTZXJ2aWNlKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcnJheSwga2V5KSB7XG4gICAgdmFyIHNvcnRTdGF0ZSA9IHViU29ydFNlcnZpY2Uuc3RhdGVba2V5XTtcbiAgICBpZiAoc29ydFN0YXRlICYmIHNvcnRTdGF0ZS5wcmVkaWNhdGUpIHtcbiAgICAgIHJldHVybiAkZmlsdGVyKCdvcmRlckJ5JykoYXJyYXksIHNvcnRTdGF0ZS5wcmVkaWNhdGUsIHNvcnRTdGF0ZS5yZXZlcnNlKTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xuICB9O1xufVxuXG5zb3J0QnlGaWx0ZXIuJGluamVjdCA9IFsnJGZpbHRlcicsICd1YlNvcnRTZXJ2aWNlJ107XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gIGlmIChtb2R1bGUpIHtcbiAgICBtb2R1bGUuZmlsdGVyKCd1YlNvcnRCeScsIHNvcnRCeUZpbHRlcik7XG4gIH1cbiAgcmV0dXJuIHNvcnRCeUZpbHRlcjtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAbmdkb2MgZGlyZWN0aXZlXG4gKiBAbmFtZSB1YlNvcnRDb2xcbiAqIEByZXN0cmljdCBBXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBEZWNvcmF0ZXMgdGhlIGVsZW1lbnQgd2l0aCBhIGNsaWNrIGhhbmRsZXIgdG8gY29udHJvbCBzb3J0aW5nLlxuICpcbiAqIEBwYXJhbSBzb3J0SW5pdGlhbCB7YXNjZW5kaW5nfGRlc2NlbmRpbmd9IERldGVybWluZXMgaWYgdGhpcyBjb2x1bW4gc2hvdWxkIGJlIHNvcnRlZCB3aGVuIHRoZSB2aWV3IGlzIGxvYWRlZFxuICovXG5mdW5jdGlvbiBzb3J0Q29sKCRwYXJzZSkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgcmVxdWlyZTogJ151YlNvcnQnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyLCBjdHJsKSB7XG4gICAgICB2YXIgc3RhdGVzID0gY3RybC5zdGF0ZXM7XG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZXMubm9uZTtcbiAgICAgIHZhciBwcmVkaWNhdGUgPSBhdHRyLnViU29ydENvbDtcbiAgICAgIHZhciBwYXJzZWRQcmVkaWNhdGUgPSAkcGFyc2UocHJlZGljYXRlKTtcblxuICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihwYXJzZWRQcmVkaWNhdGUoc2NvcGUpKSkge1xuICAgICAgICBwcmVkaWNhdGUgPSBwYXJzZWRQcmVkaWNhdGUoc2NvcGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXR0ci5zb3J0SW5pdGlhbCkge1xuICAgICAgICBzdGF0ZSA9IHN0YXRlc1thdHRyLnNvcnRJbml0aWFsXSB8fCBzdGF0ZXMuYXNjZW5kaW5nO1xuICAgICAgICBhcHBseVNvcnQoKTtcbiAgICAgIH1cblxuICAgICAgLy8gVE9ETyAtIE1ha2UgdGhpcyBjbGFzcyBjb25maWd1cmFibGVcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ3NvcnQtY29sJyk7XG5cbiAgICAgIGVsZW1lbnQuYmluZCgnY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHByZWRpY2F0ZSkge1xuICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzdGF0ZSA9IHN0YXRlID09PSBzdGF0ZXMubm9uZSB8fCBzdGF0ZSA9PT0gc3RhdGVzLmRlc2NlbmRpbmcgPyBzdGF0ZXMuYXNjZW5kaW5nIDogc3RhdGVzLmRlc2NlbmRpbmc7XG4gICAgICAgICAgICBhcHBseVNvcnQoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHNjb3BlLiRvbigndWI6c29ydCcsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xuICAgICAgICBpZiAoYXJncy5wcmVkaWNhdGUgIT09IHByZWRpY2F0ZSkge1xuICAgICAgICAgIHN0YXRlID0gc3RhdGVzLm5vbmU7XG4gICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcyhzdGF0ZXMuYXNjZW5kaW5nKS5yZW1vdmVDbGFzcyhzdGF0ZXMuZGVzY2VuZGluZyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBmdW5jdGlvbiBhcHBseVNvcnQoKSB7XG4gICAgICAgIGN0cmwuc29ydEJ5KHByZWRpY2F0ZSwgc3RhdGUgPT09IHN0YXRlcy5kZXNjZW5kaW5nKTtcbiAgICAgICAgZWxlbWVudFxuICAgICAgICAgIC5yZW1vdmVDbGFzcyhzdGF0ZXMuYXNjZW5kaW5nKVxuICAgICAgICAgIC5yZW1vdmVDbGFzcyhzdGF0ZXMuZGVzY2VuZGluZylcbiAgICAgICAgICAuYWRkQ2xhc3Moc3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuc29ydENvbC4kaW5qZWN0ID0gWyckcGFyc2UnXTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtb2R1bGUpIHtcbiAgaWYgKG1vZHVsZSkge1xuICAgIG1vZHVsZS5kaXJlY3RpdmUoJ3ViU29ydENvbCcsIHNvcnRDb2wpO1xuICB9XG4gIHJldHVybiBzb3J0Q29sO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBuZ2RvYyBjb250cm9sbGVyXG4gKiBAbmFtZSB1YlNvcnRDb250cm9sbGVyXG4gKiBcbiAqIEBkZXNjcmlwdGlvblxuICogQ29udHJvbGxlciB1c2VkIGJ5IHRoZSBzb3J0VGFibGUgZGlyZWN0aXZlXG4gKi9cbmZ1bmN0aW9uIFNvcnRDb250cm9sbGVyKCRzY29wZSwgJGF0dHJzLCAkcGFyc2UsIHViU29ydFNlcnZpY2UpIHtcbiAgdmFyIGtleSA9ICRhdHRycy51YlNvcnQ7XG4gIHZhciBvblNvcnRCeSA9IGZ1bmN0aW9uKCkge307XG5cbiAgaWYgKCRhdHRycy5vblNvcnRCeSkge1xuICAgIG9uU29ydEJ5ID0gJHBhcnNlKCRhdHRycy5vblNvcnRCeSkoJHNjb3BlKTtcbiAgfVxuXG4gIC8vIFRPRE8gLSBNYWtlIHRoZSBzdGF0ZSBjbGFzc2VzIGNvbmZpZ3VyYWJsZVxuICB0aGlzLnN0YXRlcyA9IHtcbiAgICBub25lOiAnJyxcbiAgICBhc2NlbmRpbmc6ICdhc2MnLFxuICAgIGRlc2NlbmRpbmc6ICdkZXNjJ1xuICB9O1xuXG4gIHRoaXMuc29ydEJ5ID0gZnVuY3Rpb24gc29ydEJ5KHByZWRpY2F0ZSwgcmV2ZXJzZSkge1xuICAgIHViU29ydFNlcnZpY2UudXBkYXRlU29ydFN0YXRlKGtleSwgcHJlZGljYXRlLCByZXZlcnNlKTtcbiAgICBvblNvcnRCeShrZXksIHByZWRpY2F0ZSwgcmV2ZXJzZSk7XG4gICAgJHNjb3BlLiRicm9hZGNhc3QoJ3ViOnNvcnQnLCB7cHJlZGljYXRlOiBwcmVkaWNhdGV9KTtcbiAgfTtcbn1cblxuU29ydENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRhdHRycycsICckcGFyc2UnLCAndWJTb3J0U2VydmljZSddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuICBpZiAobW9kdWxlKSB7XG4gICAgbW9kdWxlLmNvbnRyb2xsZXIoJ3ViU29ydENvbnRyb2xsZXInLCBTb3J0Q29udHJvbGxlcik7XG4gIH1cbiAgcmV0dXJuIFNvcnRDb250cm9sbGVyO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgU29ydENvbnRyb2xsZXIgPSByZXF1aXJlKCcuL3NvcnQtY29udHJvbGxlcicpKCk7XG5cbi8qKlxuICogQG5nZG9jIGRpcmVjdGl2ZVxuICogQG5hbWUgdWJTb3J0XG4gKiBAcmVzdHJpY3QgQVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogVGhpcyBkaXJlY3RpdmUgYWN0cyBhcyBhbiBvcmNoZXN0cmF0b3IgZm9yIHNvcnRpbmcuXG4gKlxuICogQHBhcmFtIG9uU29ydEJ5IHtleHByZXNzaW9ufSBDYWxsYmFja1xuICovXG5mdW5jdGlvbiBzb3J0KCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgY29udHJvbGxlcjogU29ydENvbnRyb2xsZXIsXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRyLCBjdHJsKSB7XG4gICAgICAvLyBUT0RPIC0gTWFrZSB0aGlzIGNsYXNzIGNvbmZpZ3VyYWJsZVxuICAgICAgZWxlbWVudC5hZGRDbGFzcygnc29ydGFibGUnKTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gIGlmIChtb2R1bGUpIHtcbiAgICBtb2R1bGUuZGlyZWN0aXZlKCd1YlNvcnQnLCBzb3J0KTtcbiAgfVxuICByZXR1cm4gc29ydDtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgdWJTb3J0U2VydmljZVxuICogQGtpbmQgZnVuY3Rpb25cbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEhvbGRzIGFuZCBtYW5hZ2VzIHN0YXRlIGZvciBzb3J0aW5nIGRpcmVjdGl2ZXMuXG4gKi9cbmZ1bmN0aW9uIFNvcnRTZXJ2aWNlKCkge1xuICB0aGlzLnN0YXRlID0ge307XG59XG5cblNvcnRTZXJ2aWNlLnByb3RvdHlwZS51cGRhdGVTb3J0U3RhdGUgPSBmdW5jdGlvbihrZXksIHByZWRpY2F0ZSwgcmV2ZXJzZSkge1xuICB0aGlzLnN0YXRlW2tleV0gPSB0aGlzLnN0YXRlW2tleV0gfHwge307XG4gIHRoaXMuc3RhdGVba2V5XS5wcmVkaWNhdGUgPSBwcmVkaWNhdGU7XG4gIHRoaXMuc3RhdGVba2V5XS5yZXZlcnNlID0gcmV2ZXJzZSA9PT0gdHJ1ZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gIGlmIChtb2R1bGUpIHtcbiAgICBtb2R1bGUuc2VydmljZSgndWJTb3J0U2VydmljZScsIFNvcnRTZXJ2aWNlKTtcbiAgfVxuICByZXR1cm4gU29ydFNlcnZpY2U7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGRlZmluZU1vZHVsZShhbmd1bGFyKSB7XG4gIHZhciBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgndWItc29ydCcsIFtdKTtcblxuICByZXF1aXJlKCcuL3NvcnQtc2VydmljZScpKG1vZHVsZSk7XG4gIHJlcXVpcmUoJy4vc29ydC1ieScpKG1vZHVsZSk7XG4gIHJlcXVpcmUoJy4vc29ydC1jb250cm9sbGVyJykobW9kdWxlKTtcbiAgcmVxdWlyZSgnLi9zb3J0LWRpcmVjdGl2ZScpKG1vZHVsZSk7XG4gIHJlcXVpcmUoJy4vc29ydC1jb2wtZGlyZWN0aXZlJykobW9kdWxlKTtcblxuICByZXR1cm4gbW9kdWxlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmluZU1vZHVsZTtcbiJdfQ==

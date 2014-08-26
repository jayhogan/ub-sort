!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ubSort=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var angular = window.angular;
var subModules = [
  require('./lib/sort')(angular).name
];

module.exports = angular.module('ng-utility-belt', subModules);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qaG9nYW4vZGV2L3ViLXNvcnQvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4vYnJvd3Nlci5qcyIsIi9Vc2Vycy9qaG9nYW4vZGV2L3ViLXNvcnQvbGliL3NvcnQtYnkuanMiLCIvVXNlcnMvamhvZ2FuL2Rldi91Yi1zb3J0L2xpYi9zb3J0LWNvbC1kaXJlY3RpdmUuanMiLCIvVXNlcnMvamhvZ2FuL2Rldi91Yi1zb3J0L2xpYi9zb3J0LWNvbnRyb2xsZXIuanMiLCIvVXNlcnMvamhvZ2FuL2Rldi91Yi1zb3J0L2xpYi9zb3J0LWRpcmVjdGl2ZS5qcyIsIi9Vc2Vycy9qaG9nYW4vZGV2L3ViLXNvcnQvbGliL3NvcnQtc2VydmljZS5qcyIsIi9Vc2Vycy9qaG9nYW4vZGV2L3ViLXNvcnQvbGliL3NvcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGFuZ3VsYXIgPSB3aW5kb3cuYW5ndWxhcjtcbnZhciBzdWJNb2R1bGVzID0gW1xuICByZXF1aXJlKCcuL2xpYi9zb3J0JykoYW5ndWxhcikubmFtZVxuXTtcblxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgnbmctdXRpbGl0eS1iZWx0Jywgc3ViTW9kdWxlcyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQG5nZG9jIGZpbHRlclxuICogQG5hbWUgdWJTb3J0QnlcbiAqIEBraW5kIGZ1bmN0aW9uXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBGZXRjaGVzIHRoZSBzb3J0IHN0YXRlIGZvciB0aGUgZ2l2ZW4gc29ydFRhYmxlIGFuZCBkZWxlZ2F0ZXMgdG8gdGhlIG5hdGl2ZVxuICogQW5ndWxhciBvcmRlckJ5IGZpbHRlci5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc29ydC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgU29ydCBpZGVudGlmaWNhdGlvblxuICpcbiAqIEByZXR1cm5zIHtBcnJheX0gU29ydGVkIGNvcHkgb2YgdGhlIHNvdXJjZSBhcnJheS5cbiAqL1xuZnVuY3Rpb24gc29ydEJ5RmlsdGVyKCRmaWx0ZXIsIHViU29ydFNlcnZpY2UpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFycmF5LCBrZXkpIHtcbiAgICB2YXIgc29ydFN0YXRlID0gdWJTb3J0U2VydmljZS5zdGF0ZVtrZXldO1xuICAgIGlmIChzb3J0U3RhdGUgJiYgc29ydFN0YXRlLnByZWRpY2F0ZSkge1xuICAgICAgcmV0dXJuICRmaWx0ZXIoJ29yZGVyQnknKShhcnJheSwgc29ydFN0YXRlLnByZWRpY2F0ZSwgc29ydFN0YXRlLnJldmVyc2UpO1xuICAgIH1cbiAgICByZXR1cm4gYXJyYXk7XG4gIH07XG59XG5cbnNvcnRCeUZpbHRlci4kaW5qZWN0ID0gWyckZmlsdGVyJywgJ3ViU29ydFNlcnZpY2UnXTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtb2R1bGUpIHtcbiAgaWYgKG1vZHVsZSkge1xuICAgIG1vZHVsZS5maWx0ZXIoJ3ViU29ydEJ5Jywgc29ydEJ5RmlsdGVyKTtcbiAgfVxuICByZXR1cm4gc29ydEJ5RmlsdGVyO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBuZ2RvYyBkaXJlY3RpdmVcbiAqIEBuYW1lIHViU29ydENvbFxuICogQHJlc3RyaWN0IEFcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIERlY29yYXRlcyB0aGUgZWxlbWVudCB3aXRoIGEgY2xpY2sgaGFuZGxlciB0byBjb250cm9sIHNvcnRpbmcuXG4gKlxuICogQHBhcmFtIHNvcnRJbml0aWFsIHthc2NlbmRpbmd8ZGVzY2VuZGluZ30gRGV0ZXJtaW5lcyBpZiB0aGlzIGNvbHVtbiBzaG91bGQgYmUgc29ydGVkIHdoZW4gdGhlIHZpZXcgaXMgbG9hZGVkXG4gKi9cbmZ1bmN0aW9uIHNvcnRDb2woJHBhcnNlKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICByZXF1aXJlOiAnXnViU29ydCcsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHIsIGN0cmwpIHtcbiAgICAgIHZhciBzdGF0ZXMgPSBjdHJsLnN0YXRlcztcbiAgICAgIHZhciBzdGF0ZSA9IHN0YXRlcy5ub25lO1xuICAgICAgdmFyIHByZWRpY2F0ZSA9IGF0dHIudWJTb3J0Q29sO1xuICAgICAgdmFyIHBhcnNlZFByZWRpY2F0ZSA9ICRwYXJzZShwcmVkaWNhdGUpO1xuXG4gICAgICBpZiAoYW5ndWxhci5pc0Z1bmN0aW9uKHBhcnNlZFByZWRpY2F0ZShzY29wZSkpKSB7XG4gICAgICAgIHByZWRpY2F0ZSA9IHBhcnNlZFByZWRpY2F0ZShzY29wZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChhdHRyLnNvcnRJbml0aWFsKSB7XG4gICAgICAgIHN0YXRlID0gc3RhdGVzW2F0dHIuc29ydEluaXRpYWxdIHx8IHN0YXRlcy5hc2NlbmRpbmc7XG4gICAgICAgIGFwcGx5U29ydCgpO1xuICAgICAgfVxuXG4gICAgICAvLyBUT0RPIC0gTWFrZSB0aGlzIGNsYXNzIGNvbmZpZ3VyYWJsZVxuICAgICAgZWxlbWVudC5hZGRDbGFzcygnc29ydC1jb2wnKTtcblxuICAgICAgZWxlbWVudC5iaW5kKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAocHJlZGljYXRlKSB7XG4gICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHN0YXRlID0gc3RhdGUgPT09IHN0YXRlcy5ub25lIHx8IHN0YXRlID09PSBzdGF0ZXMuZGVzY2VuZGluZyA/IHN0YXRlcy5hc2NlbmRpbmcgOiBzdGF0ZXMuZGVzY2VuZGluZztcbiAgICAgICAgICAgIGFwcGx5U29ydCgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgc2NvcGUuJG9uKCd1Yjpzb3J0JywgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XG4gICAgICAgIGlmIChhcmdzLnByZWRpY2F0ZSAhPT0gcHJlZGljYXRlKSB7XG4gICAgICAgICAgc3RhdGUgPSBzdGF0ZXMubm9uZTtcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKHN0YXRlcy5hc2NlbmRpbmcpLnJlbW92ZUNsYXNzKHN0YXRlcy5kZXNjZW5kaW5nKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5U29ydCgpIHtcbiAgICAgICAgY3RybC5zb3J0QnkocHJlZGljYXRlLCBzdGF0ZSA9PT0gc3RhdGVzLmRlc2NlbmRpbmcpO1xuICAgICAgICBlbGVtZW50XG4gICAgICAgICAgLnJlbW92ZUNsYXNzKHN0YXRlcy5hc2NlbmRpbmcpXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKHN0YXRlcy5kZXNjZW5kaW5nKVxuICAgICAgICAgIC5hZGRDbGFzcyhzdGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5zb3J0Q29sLiRpbmplY3QgPSBbJyRwYXJzZSddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuICBpZiAobW9kdWxlKSB7XG4gICAgbW9kdWxlLmRpcmVjdGl2ZSgndWJTb3J0Q29sJywgc29ydENvbCk7XG4gIH1cbiAgcmV0dXJuIHNvcnRDb2w7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQG5nZG9jIGNvbnRyb2xsZXJcbiAqIEBuYW1lIHViU29ydENvbnRyb2xsZXJcbiAqIFxuICogQGRlc2NyaXB0aW9uXG4gKiBDb250cm9sbGVyIHVzZWQgYnkgdGhlIHNvcnRUYWJsZSBkaXJlY3RpdmVcbiAqL1xuZnVuY3Rpb24gU29ydENvbnRyb2xsZXIoJHNjb3BlLCAkYXR0cnMsICRwYXJzZSwgdWJTb3J0U2VydmljZSkge1xuICB2YXIga2V5ID0gJGF0dHJzLnViU29ydDtcbiAgdmFyIG9uU29ydEJ5ID0gZnVuY3Rpb24oKSB7fTtcblxuICBpZiAoJGF0dHJzLm9uU29ydEJ5KSB7XG4gICAgb25Tb3J0QnkgPSAkcGFyc2UoJGF0dHJzLm9uU29ydEJ5KSgkc2NvcGUpO1xuICB9XG5cbiAgLy8gVE9ETyAtIE1ha2UgdGhlIHN0YXRlIGNsYXNzZXMgY29uZmlndXJhYmxlXG4gIHRoaXMuc3RhdGVzID0ge1xuICAgIG5vbmU6ICcnLFxuICAgIGFzY2VuZGluZzogJ2FzYycsXG4gICAgZGVzY2VuZGluZzogJ2Rlc2MnXG4gIH07XG5cbiAgdGhpcy5zb3J0QnkgPSBmdW5jdGlvbiBzb3J0QnkocHJlZGljYXRlLCByZXZlcnNlKSB7XG4gICAgdWJTb3J0U2VydmljZS51cGRhdGVTb3J0U3RhdGUoa2V5LCBwcmVkaWNhdGUsIHJldmVyc2UpO1xuICAgIG9uU29ydEJ5KGtleSwgcHJlZGljYXRlLCByZXZlcnNlKTtcbiAgICAkc2NvcGUuJGJyb2FkY2FzdCgndWI6c29ydCcsIHtwcmVkaWNhdGU6IHByZWRpY2F0ZX0pO1xuICB9O1xufVxuXG5Tb3J0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGF0dHJzJywgJyRwYXJzZScsICd1YlNvcnRTZXJ2aWNlJ107XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gIGlmIChtb2R1bGUpIHtcbiAgICBtb2R1bGUuY29udHJvbGxlcigndWJTb3J0Q29udHJvbGxlcicsIFNvcnRDb250cm9sbGVyKTtcbiAgfVxuICByZXR1cm4gU29ydENvbnRyb2xsZXI7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBTb3J0Q29udHJvbGxlciA9IHJlcXVpcmUoJy4vc29ydC1jb250cm9sbGVyJykoKTtcblxuLyoqXG4gKiBAbmdkb2MgZGlyZWN0aXZlXG4gKiBAbmFtZSB1YlNvcnRcbiAqIEByZXN0cmljdCBBXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGlzIGRpcmVjdGl2ZSBhY3RzIGFzIGFuIG9yY2hlc3RyYXRvciBmb3Igc29ydGluZy5cbiAqXG4gKiBAcGFyYW0gb25Tb3J0Qnkge2V4cHJlc3Npb259IENhbGxiYWNrXG4gKi9cbmZ1bmN0aW9uIHNvcnQoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICBjb250cm9sbGVyOiBTb3J0Q29udHJvbGxlcixcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIsIGN0cmwpIHtcbiAgICAgIC8vIFRPRE8gLSBNYWtlIHRoaXMgY2xhc3MgY29uZmlndXJhYmxlXG4gICAgICBlbGVtZW50LmFkZENsYXNzKCdzb3J0YWJsZScpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtb2R1bGUpIHtcbiAgaWYgKG1vZHVsZSkge1xuICAgIG1vZHVsZS5kaXJlY3RpdmUoJ3ViU29ydCcsIHNvcnQpO1xuICB9XG4gIHJldHVybiBzb3J0O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBuZ2RvYyBzZXJ2aWNlXG4gKiBAbmFtZSB1YlNvcnRTZXJ2aWNlXG4gKiBAa2luZCBmdW5jdGlvblxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogSG9sZHMgYW5kIG1hbmFnZXMgc3RhdGUgZm9yIHNvcnRpbmcgZGlyZWN0aXZlcy5cbiAqL1xuZnVuY3Rpb24gU29ydFNlcnZpY2UoKSB7XG4gIHRoaXMuc3RhdGUgPSB7fTtcbn1cblxuU29ydFNlcnZpY2UucHJvdG90eXBlLnVwZGF0ZVNvcnRTdGF0ZSA9IGZ1bmN0aW9uKGtleSwgcHJlZGljYXRlLCByZXZlcnNlKSB7XG4gIHRoaXMuc3RhdGVba2V5XSA9IHRoaXMuc3RhdGVba2V5XSB8fCB7fTtcbiAgdGhpcy5zdGF0ZVtrZXldLnByZWRpY2F0ZSA9IHByZWRpY2F0ZTtcbiAgdGhpcy5zdGF0ZVtrZXldLnJldmVyc2UgPSByZXZlcnNlID09PSB0cnVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtb2R1bGUpIHtcbiAgaWYgKG1vZHVsZSkge1xuICAgIG1vZHVsZS5zZXJ2aWNlKCd1YlNvcnRTZXJ2aWNlJywgU29ydFNlcnZpY2UpO1xuICB9XG4gIHJldHVybiBTb3J0U2VydmljZTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gZGVmaW5lTW9kdWxlKGFuZ3VsYXIpIHtcbiAgdmFyIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd1Yi1zb3J0JywgW10pO1xuXG4gIHJlcXVpcmUoJy4vc29ydC1zZXJ2aWNlJykobW9kdWxlKTtcbiAgcmVxdWlyZSgnLi9zb3J0LWJ5JykobW9kdWxlKTtcbiAgcmVxdWlyZSgnLi9zb3J0LWNvbnRyb2xsZXInKShtb2R1bGUpO1xuICByZXF1aXJlKCcuL3NvcnQtZGlyZWN0aXZlJykobW9kdWxlKTtcbiAgcmVxdWlyZSgnLi9zb3J0LWNvbC1kaXJlY3RpdmUnKShtb2R1bGUpO1xuXG4gIHJldHVybiBtb2R1bGU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmaW5lTW9kdWxlO1xuIl19

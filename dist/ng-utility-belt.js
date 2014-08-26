!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ngUtilityBelt=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var angular = window.angular;
var subModules = [
  require('./sort/sort')(angular).name
];

module.exports = angular.module('ng-utility-belt', subModules);

},{"./sort/sort":7}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
'use strict';

/**
 * @ngdoc directive
 * @name sortCol
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
    require: '^nubSort',
    link: function(scope, element, attr, ctrl) {
      var states = ctrl.states;
      var state = states.none;
      var predicate = attr.nubSortCol;
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

      scope.$on('nub:sort', function (event, args) {
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
}

sortCol.$inject = ['$parse'];

module.exports = sortCol;

},{}],4:[function(require,module,exports){
'use strict';

/**
 * @ngdoc controller
 * @name SortTableController
 * 
 * @description
 * Controller used by the sortTable directive
 */
function SortController($scope, $attrs, $parse, nubSortService) {
  var key = $attrs.nubSort;
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

SortController.$inject = ['$scope', '$attrs', '$parse', 'nubSortService'];

module.exports = SortController;

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
'use strict';

/**
 * @ngdoc service
 * @name nubSortService
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

module.exports = SortService;

},{}],7:[function(require,module,exports){
'use strict';

function defineModule(angular) {
  return angular.module('ng-utility-belt.sort', [])
    .service(   'nubSortService',     require('./sort-service'))
    .filter(    'nubSortBy',          require('./sort-by'))
    .controller('NubSortController',  require('./sort-controller'))
    .directive( 'nubSort',            require('./sort-directive'))
    .directive( 'nubSortCol',         require('./sort-col-directive'));
}

module.exports = defineModule;

},{"./sort-by":2,"./sort-col-directive":3,"./sort-controller":4,"./sort-directive":5,"./sort-service":6}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qaG9nYW4vZGV2L25nLXV0aWxpdHktYmVsdC9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiLi9tb2R1bGVzL2luZGV4LmpzIiwiL1VzZXJzL2pob2dhbi9kZXYvbmctdXRpbGl0eS1iZWx0L21vZHVsZXMvc29ydC9zb3J0LWJ5LmpzIiwiL1VzZXJzL2pob2dhbi9kZXYvbmctdXRpbGl0eS1iZWx0L21vZHVsZXMvc29ydC9zb3J0LWNvbC1kaXJlY3RpdmUuanMiLCIvVXNlcnMvamhvZ2FuL2Rldi9uZy11dGlsaXR5LWJlbHQvbW9kdWxlcy9zb3J0L3NvcnQtY29udHJvbGxlci5qcyIsIi9Vc2Vycy9qaG9nYW4vZGV2L25nLXV0aWxpdHktYmVsdC9tb2R1bGVzL3NvcnQvc29ydC1kaXJlY3RpdmUuanMiLCIvVXNlcnMvamhvZ2FuL2Rldi9uZy11dGlsaXR5LWJlbHQvbW9kdWxlcy9zb3J0L3NvcnQtc2VydmljZS5qcyIsIi9Vc2Vycy9qaG9nYW4vZGV2L25nLXV0aWxpdHktYmVsdC9tb2R1bGVzL3NvcnQvc29ydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBhbmd1bGFyID0gd2luZG93LmFuZ3VsYXI7XG52YXIgc3ViTW9kdWxlcyA9IFtcbiAgcmVxdWlyZSgnLi9zb3J0L3NvcnQnKShhbmd1bGFyKS5uYW1lXG5dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCduZy11dGlsaXR5LWJlbHQnLCBzdWJNb2R1bGVzKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAbmdkb2MgZmlsdGVyXG4gKiBAbmFtZSBzb3J0QnlcbiAqIEBraW5kIGZ1bmN0aW9uXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBGZXRjaGVzIHRoZSBzb3J0IHN0YXRlIGZvciB0aGUgZ2l2ZW4gc29ydFRhYmxlIGFuZCBkZWxlZ2F0ZXMgdG8gdGhlIG5hdGl2ZVxuICogQW5ndWxhciBvcmRlckJ5IGZpbHRlci5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc29ydC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgU29ydCBpZGVudGlmaWNhdGlvblxuICpcbiAqIEByZXR1cm5zIHtBcnJheX0gU29ydGVkIGNvcHkgb2YgdGhlIHNvdXJjZSBhcnJheS5cbiAqL1xuZnVuY3Rpb24gc29ydEJ5RmlsdGVyKCRmaWx0ZXIsIG51YlNvcnRTZXJ2aWNlKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcnJheSwga2V5KSB7XG4gICAgdmFyIHNvcnRTdGF0ZSA9IG51YlNvcnRTZXJ2aWNlLnN0YXRlW2tleV07XG4gICAgaWYgKHNvcnRTdGF0ZSAmJiBzb3J0U3RhdGUucHJlZGljYXRlKSB7XG4gICAgICByZXR1cm4gJGZpbHRlcignb3JkZXJCeScpKGFycmF5LCBzb3J0U3RhdGUucHJlZGljYXRlLCBzb3J0U3RhdGUucmV2ZXJzZSk7XG4gICAgfVxuICAgIHJldHVybiBhcnJheTtcbiAgfTtcbn1cblxuc29ydEJ5RmlsdGVyLiRpbmplY3QgPSBbJyRmaWx0ZXInLCAnbnViU29ydFNlcnZpY2UnXTtcblxubW9kdWxlLmV4cG9ydHMgPSBzb3J0QnlGaWx0ZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQG5nZG9jIGRpcmVjdGl2ZVxuICogQG5hbWUgc29ydENvbFxuICogQHJlc3RyaWN0IEFcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIERlY29yYXRlcyB0aGUgZWxlbWVudCB3aXRoIGEgY2xpY2sgaGFuZGxlciB0byBjb250cm9sIHNvcnRpbmcuXG4gKlxuICogQHBhcmFtIHNvcnRJbml0aWFsIHthc2NlbmRpbmd8ZGVzY2VuZGluZ30gRGV0ZXJtaW5lcyBpZiB0aGlzIGNvbHVtbiBzaG91bGQgYmUgc29ydGVkIHdoZW4gdGhlIHZpZXcgaXMgbG9hZGVkXG4gKi9cbmZ1bmN0aW9uIHNvcnRDb2woJHBhcnNlKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICByZXF1aXJlOiAnXm51YlNvcnQnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyLCBjdHJsKSB7XG4gICAgICB2YXIgc3RhdGVzID0gY3RybC5zdGF0ZXM7XG4gICAgICB2YXIgc3RhdGUgPSBzdGF0ZXMubm9uZTtcbiAgICAgIHZhciBwcmVkaWNhdGUgPSBhdHRyLm51YlNvcnRDb2w7XG4gICAgICB2YXIgcGFyc2VkUHJlZGljYXRlID0gJHBhcnNlKHByZWRpY2F0ZSk7XG5cbiAgICAgIGlmIChhbmd1bGFyLmlzRnVuY3Rpb24ocGFyc2VkUHJlZGljYXRlKHNjb3BlKSkpIHtcbiAgICAgICAgcHJlZGljYXRlID0gcGFyc2VkUHJlZGljYXRlKHNjb3BlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGF0dHIuc29ydEluaXRpYWwpIHtcbiAgICAgICAgc3RhdGUgPSBzdGF0ZXNbYXR0ci5zb3J0SW5pdGlhbF0gfHwgc3RhdGVzLmFzY2VuZGluZztcbiAgICAgICAgYXBwbHlTb3J0KCk7XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ3NvcnQtY29sJyk7XG5cbiAgICAgIGVsZW1lbnQuYmluZCgnY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHByZWRpY2F0ZSkge1xuICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzdGF0ZSA9IHN0YXRlID09PSBzdGF0ZXMubm9uZSB8fCBzdGF0ZSA9PT0gc3RhdGVzLmRlc2NlbmRpbmcgPyBzdGF0ZXMuYXNjZW5kaW5nIDogc3RhdGVzLmRlc2NlbmRpbmc7XG4gICAgICAgICAgICBhcHBseVNvcnQoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHNjb3BlLiRvbignbnViOnNvcnQnLCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpIHtcbiAgICAgICAgaWYgKGFyZ3MucHJlZGljYXRlICE9PSBwcmVkaWNhdGUpIHtcbiAgICAgICAgICBzdGF0ZSA9IHN0YXRlcy5ub25lO1xuICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2FzYycpLnJlbW92ZUNsYXNzKCdkZXNjJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBmdW5jdGlvbiBhcHBseVNvcnQoKSB7XG4gICAgICAgIGN0cmwuc29ydEJ5KHByZWRpY2F0ZSwgc3RhdGUgPT09IHN0YXRlcy5kZXNjZW5kaW5nKTtcbiAgICAgICAgZWxlbWVudFxuICAgICAgICAgIC5yZW1vdmVDbGFzcyhzdGF0ZXMuYXNjZW5kaW5nKVxuICAgICAgICAgIC5yZW1vdmVDbGFzcyhzdGF0ZXMuZGVzY2VuZGluZylcbiAgICAgICAgICAuYWRkQ2xhc3Moc3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuc29ydENvbC4kaW5qZWN0ID0gWyckcGFyc2UnXTtcblxubW9kdWxlLmV4cG9ydHMgPSBzb3J0Q29sO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBuZ2RvYyBjb250cm9sbGVyXG4gKiBAbmFtZSBTb3J0VGFibGVDb250cm9sbGVyXG4gKiBcbiAqIEBkZXNjcmlwdGlvblxuICogQ29udHJvbGxlciB1c2VkIGJ5IHRoZSBzb3J0VGFibGUgZGlyZWN0aXZlXG4gKi9cbmZ1bmN0aW9uIFNvcnRDb250cm9sbGVyKCRzY29wZSwgJGF0dHJzLCAkcGFyc2UsIG51YlNvcnRTZXJ2aWNlKSB7XG4gIHZhciBrZXkgPSAkYXR0cnMubnViU29ydDtcbiAgdmFyIG9uU29ydEJ5ID0gZnVuY3Rpb24oKSB7fTtcblxuICBpZiAoJGF0dHJzLm9uU29ydEJ5KSB7XG4gICAgb25Tb3J0QnkgPSAkcGFyc2UoJGF0dHJzLm9uU29ydEJ5KSgkc2NvcGUpO1xuICB9XG5cbiAgLy8gVE9ETyAtIENvbmZpZ3VyYWJsZSBieSBwcm92aWRlcj9cbiAgdGhpcy5zdGF0ZXMgPSB7XG4gICAgbm9uZTogJycsXG4gICAgYXNjZW5kaW5nOiAnYXNjJyxcbiAgICBkZXNjZW5kaW5nOiAnZGVzYydcbiAgfTtcblxuICB0aGlzLnNvcnRCeSA9IGZ1bmN0aW9uIHNvcnRCeShwcmVkaWNhdGUsIHJldmVyc2UpIHtcbiAgICBudWJTb3J0U2VydmljZS51cGRhdGVTb3J0U3RhdGUoa2V5LCBwcmVkaWNhdGUsIHJldmVyc2UpO1xuICAgIG9uU29ydEJ5KGtleSwgcHJlZGljYXRlLCByZXZlcnNlKTtcbiAgICAkc2NvcGUuJGJyb2FkY2FzdCgnbnViOnNvcnQnLCB7cHJlZGljYXRlOiBwcmVkaWNhdGV9KTtcbiAgfTtcbn1cblxuU29ydENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRhdHRycycsICckcGFyc2UnLCAnbnViU29ydFNlcnZpY2UnXTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb3J0Q29udHJvbGxlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAbmdkb2MgZGlyZWN0aXZlXG4gKiBAbmFtZSBzb3J0XG4gKiBAcmVzdHJpY3QgQVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogVGhpcyBkaXJlY3RpdmUgYWN0cyBhcyBhbiBvcmNoZXN0cmF0b3IgZm9yIHNvcnRpbmcuXG4gKlxuICogQHBhcmFtIG9uU29ydEJ5IHtleHByZXNzaW9ufSBDYWxsYmFja1xuICovXG5mdW5jdGlvbiBzb3J0KCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgY29udHJvbGxlcjogJ051YlNvcnRDb250cm9sbGVyJyxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIsIGN0cmwpIHtcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ3NvcnRhYmxlJyk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNvcnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQG5nZG9jIHNlcnZpY2VcbiAqIEBuYW1lIG51YlNvcnRTZXJ2aWNlXG4gKiBAa2luZCBmdW5jdGlvblxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogSG9sZHMgYW5kIG1hbmFnZXMgc3RhdGUgZm9yIHNvcnRpbmcgZGlyZWN0aXZlcy5cbiAqL1xuZnVuY3Rpb24gU29ydFNlcnZpY2UoKSB7XG4gIHRoaXMuc3RhdGUgPSB7fTtcbn1cblxuU29ydFNlcnZpY2UucHJvdG90eXBlLnVwZGF0ZVNvcnRTdGF0ZSA9IGZ1bmN0aW9uKGtleSwgcHJlZGljYXRlLCByZXZlcnNlKSB7XG4gIHRoaXMuc3RhdGVba2V5XSA9IHRoaXMuc3RhdGVba2V5XSB8fCB7fTtcbiAgdGhpcy5zdGF0ZVtrZXldLnByZWRpY2F0ZSA9IHByZWRpY2F0ZTtcbiAgdGhpcy5zdGF0ZVtrZXldLnJldmVyc2UgPSByZXZlcnNlID09PSB0cnVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb3J0U2VydmljZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gZGVmaW5lTW9kdWxlKGFuZ3VsYXIpIHtcbiAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCduZy11dGlsaXR5LWJlbHQuc29ydCcsIFtdKVxuICAgIC5zZXJ2aWNlKCAgICdudWJTb3J0U2VydmljZScsICAgICByZXF1aXJlKCcuL3NvcnQtc2VydmljZScpKVxuICAgIC5maWx0ZXIoICAgICdudWJTb3J0QnknLCAgICAgICAgICByZXF1aXJlKCcuL3NvcnQtYnknKSlcbiAgICAuY29udHJvbGxlcignTnViU29ydENvbnRyb2xsZXInLCAgcmVxdWlyZSgnLi9zb3J0LWNvbnRyb2xsZXInKSlcbiAgICAuZGlyZWN0aXZlKCAnbnViU29ydCcsICAgICAgICAgICAgcmVxdWlyZSgnLi9zb3J0LWRpcmVjdGl2ZScpKVxuICAgIC5kaXJlY3RpdmUoICdudWJTb3J0Q29sJywgICAgICAgICByZXF1aXJlKCcuL3NvcnQtY29sLWRpcmVjdGl2ZScpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVNb2R1bGU7XG4iXX0=

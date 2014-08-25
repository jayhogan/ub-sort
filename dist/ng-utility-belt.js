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
    controller: 'SortTableController',
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
  state[key] = state[key] || {};
  state[key].predicate = predicate;
  state[key].reverse = reverse === true;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy81MDEyOTg1MDEvZGV2L25nLXV0aWxpdHktYmVsdC9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiLi9tb2R1bGVzL2luZGV4LmpzIiwiL1VzZXJzLzUwMTI5ODUwMS9kZXYvbmctdXRpbGl0eS1iZWx0L21vZHVsZXMvc29ydC9zb3J0LWJ5LmpzIiwiL1VzZXJzLzUwMTI5ODUwMS9kZXYvbmctdXRpbGl0eS1iZWx0L21vZHVsZXMvc29ydC9zb3J0LWNvbC1kaXJlY3RpdmUuanMiLCIvVXNlcnMvNTAxMjk4NTAxL2Rldi9uZy11dGlsaXR5LWJlbHQvbW9kdWxlcy9zb3J0L3NvcnQtY29udHJvbGxlci5qcyIsIi9Vc2Vycy81MDEyOTg1MDEvZGV2L25nLXV0aWxpdHktYmVsdC9tb2R1bGVzL3NvcnQvc29ydC1kaXJlY3RpdmUuanMiLCIvVXNlcnMvNTAxMjk4NTAxL2Rldi9uZy11dGlsaXR5LWJlbHQvbW9kdWxlcy9zb3J0L3NvcnQtc2VydmljZS5qcyIsIi9Vc2Vycy81MDEyOTg1MDEvZGV2L25nLXV0aWxpdHktYmVsdC9tb2R1bGVzL3NvcnQvc29ydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGFuZ3VsYXIgPSB3aW5kb3cuYW5ndWxhcjtcbnZhciBzdWJNb2R1bGVzID0gW1xuICByZXF1aXJlKCcuL3NvcnQvc29ydCcpKGFuZ3VsYXIpLm5hbWVcbl07XG5cbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ25nLXV0aWxpdHktYmVsdCcsIHN1Yk1vZHVsZXMpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBuZ2RvYyBmaWx0ZXJcbiAqIEBuYW1lIHNvcnRCeVxuICogQGtpbmQgZnVuY3Rpb25cbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEZldGNoZXMgdGhlIHNvcnQgc3RhdGUgZm9yIHRoZSBnaXZlbiBzb3J0VGFibGUgYW5kIGRlbGVnYXRlcyB0byB0aGUgbmF0aXZlXG4gKiBBbmd1bGFyIG9yZGVyQnkgZmlsdGVyLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBzb3J0LlxuICogQHBhcmFtIHtTdHJpbmd9IGtleSBTb3J0IGlkZW50aWZpY2F0aW9uXG4gKlxuICogQHJldHVybnMge0FycmF5fSBTb3J0ZWQgY29weSBvZiB0aGUgc291cmNlIGFycmF5LlxuICovXG5mdW5jdGlvbiBzb3J0QnlGaWx0ZXIoJGZpbHRlciwgbnViU29ydFNlcnZpY2UpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFycmF5LCBrZXkpIHtcbiAgICB2YXIgc29ydFN0YXRlID0gbnViU29ydFNlcnZpY2Uuc3RhdGVba2V5XTtcbiAgICBpZiAoc29ydFN0YXRlICYmIHNvcnRTdGF0ZS5wcmVkaWNhdGUpIHtcbiAgICAgIHJldHVybiAkZmlsdGVyKCdvcmRlckJ5JykoYXJyYXksIHNvcnRTdGF0ZS5wcmVkaWNhdGUsIHNvcnRTdGF0ZS5yZXZlcnNlKTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xuICB9O1xufVxuXG5zb3J0QnlGaWx0ZXIuJGluamVjdCA9IFsnJGZpbHRlcicsICdudWJTb3J0U2VydmljZSddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNvcnRCeUZpbHRlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAbmdkb2MgZGlyZWN0aXZlXG4gKiBAbmFtZSBzb3J0Q29sXG4gKiBAcmVzdHJpY3QgQVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogRGVjb3JhdGVzIHRoZSBlbGVtZW50IHdpdGggYSBjbGljayBoYW5kbGVyIHRvIGNvbnRyb2wgc29ydGluZy5cbiAqXG4gKiBAcGFyYW0gc29ydEluaXRpYWwge2FzY2VuZGluZ3xkZXNjZW5kaW5nfSBEZXRlcm1pbmVzIGlmIHRoaXMgY29sdW1uIHNob3VsZCBiZSBzb3J0ZWQgd2hlbiB0aGUgdmlldyBpcyBsb2FkZWRcbiAqL1xuZnVuY3Rpb24gc29ydENvbCgkcGFyc2UpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHJlcXVpcmU6ICdebnViU29ydCcsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHIsIGN0cmwpIHtcbiAgICAgIHZhciBzdGF0ZXMgPSBjdHJsLnN0YXRlcztcbiAgICAgIHZhciBzdGF0ZSA9IHN0YXRlcy5ub25lO1xuICAgICAgdmFyIHByZWRpY2F0ZSA9IGF0dHIuc29ydENvbHVtbjtcbiAgICAgIHZhciBwYXJzZWRQcmVkaWNhdGUgPSAkcGFyc2UocHJlZGljYXRlKTtcblxuICAgICAgaWYgKGFuZ3VsYXIuaXNGdW5jdGlvbihwYXJzZWRQcmVkaWNhdGUoc2NvcGUpKSkge1xuICAgICAgICBwcmVkaWNhdGUgPSBwYXJzZWRQcmVkaWNhdGUoc2NvcGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXR0ci5zb3J0SW5pdGlhbCkge1xuICAgICAgICBzdGF0ZSA9IHN0YXRlc1thdHRyLnNvcnRJbml0aWFsXSB8fCBzdGF0ZXMuYXNjZW5kaW5nO1xuICAgICAgICBhcHBseVNvcnQoKTtcbiAgICAgIH1cblxuICAgICAgZWxlbWVudC5hZGRDbGFzcygnc29ydC1jb2wnKTtcblxuICAgICAgZWxlbWVudC5iaW5kKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAocHJlZGljYXRlKSB7XG4gICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHN0YXRlID0gc3RhdGUgPT09IHN0YXRlcy5ub25lIHx8IHN0YXRlID09PSBzdGF0ZXMuZGVzY2VuZGluZyA/IHN0YXRlcy5hc2NlbmRpbmcgOiBzdGF0ZXMuZGVzY2VuZGluZztcbiAgICAgICAgICAgIGFwcGx5U29ydCgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgc2NvcGUuJG9uKCdudWI6c29ydCcsIGZ1bmN0aW9uIChldmVudCwgYXJncykge1xuICAgICAgICBpZiAoYXJncy5wcmVkaWNhdGUgIT09IHByZWRpY2F0ZSkge1xuICAgICAgICAgIHN0YXRlID0gc3RhdGVzLm5vbmU7XG4gICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnYXNjJykucmVtb3ZlQ2xhc3MoJ2Rlc2MnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGZ1bmN0aW9uIGFwcGx5U29ydCgpIHtcbiAgICAgICAgY3RybC5zb3J0QnkocHJlZGljYXRlLCBzdGF0ZSA9PT0gc3RhdGVzLmRlc2NlbmRpbmcpO1xuICAgICAgICBlbGVtZW50XG4gICAgICAgICAgLnJlbW92ZUNsYXNzKHN0YXRlcy5hc2NlbmRpbmcpXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKHN0YXRlcy5kZXNjZW5kaW5nKVxuICAgICAgICAgIC5hZGRDbGFzcyhzdGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5zb3J0Q29sLiRpbmplY3QgPSBbJyRwYXJzZSddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNvcnRDb2w7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQG5nZG9jIGNvbnRyb2xsZXJcbiAqIEBuYW1lIFNvcnRUYWJsZUNvbnRyb2xsZXJcbiAqIFxuICogQGRlc2NyaXB0aW9uXG4gKiBDb250cm9sbGVyIHVzZWQgYnkgdGhlIHNvcnRUYWJsZSBkaXJlY3RpdmVcbiAqL1xuZnVuY3Rpb24gU29ydENvbnRyb2xsZXIoJHNjb3BlLCAkYXR0cnMsICRwYXJzZSwgbnViU29ydFNlcnZpY2UpIHtcbiAgdmFyIGtleSA9ICRhdHRycy5zb3J0VGFibGU7XG4gIHZhciBvblNvcnRCeSA9IGZ1bmN0aW9uKCkge307XG5cbiAgaWYgKCRhdHRycy5vblNvcnRCeSkge1xuICAgIG9uU29ydEJ5ID0gJHBhcnNlKCRhdHRycy5vblNvcnRCeSkoJHNjb3BlKTtcbiAgfVxuXG4gIC8vIFRPRE8gLSBDb25maWd1cmFibGUgYnkgcHJvdmlkZXI/XG4gIHRoaXMuc3RhdGVzID0ge1xuICAgIG5vbmU6ICcnLFxuICAgIGFzY2VuZGluZzogJ2FzYycsXG4gICAgZGVzY2VuZGluZzogJ2Rlc2MnXG4gIH07XG5cbiAgdGhpcy5zb3J0QnkgPSBmdW5jdGlvbiBzb3J0QnkocHJlZGljYXRlLCByZXZlcnNlKSB7XG4gICAgbnViU29ydFNlcnZpY2UudXBkYXRlU29ydFN0YXRlKGtleSwgcHJlZGljYXRlLCByZXZlcnNlKTtcbiAgICBvblNvcnRCeShrZXksIHByZWRpY2F0ZSwgcmV2ZXJzZSk7XG4gICAgJHNjb3BlLiRicm9hZGNhc3QoJ251Yjpzb3J0Jywge3ByZWRpY2F0ZTogcHJlZGljYXRlfSk7XG4gIH07XG59XG5cblNvcnRDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckYXR0cnMnLCAnJHBhcnNlJywgJ251YlNvcnRTZXJ2aWNlJ107XG5cbm1vZHVsZS5leHBvcnRzID0gU29ydENvbnRyb2xsZXI7IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBuZ2RvYyBkaXJlY3RpdmVcbiAqIEBuYW1lIHNvcnRcbiAqIEByZXN0cmljdCBBXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGlzIGRpcmVjdGl2ZSBhY3RzIGFzIGFuIG9yY2hlc3RyYXRvciBmb3Igc29ydGluZy5cbiAqXG4gKiBAcGFyYW0gb25Tb3J0Qnkge2V4cHJlc3Npb259IENhbGxiYWNrXG4gKi9cbmZ1bmN0aW9uIHNvcnQoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICBjb250cm9sbGVyOiAnU29ydFRhYmxlQ29udHJvbGxlcicsXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRyLCBjdHJsKSB7XG4gICAgICBlbGVtZW50LmFkZENsYXNzKCdzb3J0YWJsZScpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzb3J0OyIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgbnViU29ydFNlcnZpY2VcbiAqIEBraW5kIGZ1bmN0aW9uXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBIb2xkcyBhbmQgbWFuYWdlcyBzdGF0ZSBmb3Igc29ydGluZyBkaXJlY3RpdmVzLlxuICovXG5mdW5jdGlvbiBTb3J0U2VydmljZSgpIHtcbiAgdGhpcy5zdGF0ZSA9IHt9O1xufVxuXG5Tb3J0U2VydmljZS5wcm90b3R5cGUudXBkYXRlU29ydFN0YXRlID0gZnVuY3Rpb24oa2V5LCBwcmVkaWNhdGUsIHJldmVyc2UpIHtcbiAgc3RhdGVba2V5XSA9IHN0YXRlW2tleV0gfHwge307XG4gIHN0YXRlW2tleV0ucHJlZGljYXRlID0gcHJlZGljYXRlO1xuICBzdGF0ZVtrZXldLnJldmVyc2UgPSByZXZlcnNlID09PSB0cnVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb3J0U2VydmljZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gZGVmaW5lTW9kdWxlKGFuZ3VsYXIpIHtcbiAgcmV0dXJuIGFuZ3VsYXIubW9kdWxlKCduZy11dGlsaXR5LWJlbHQuc29ydCcsIFtdKVxuICAgIC5zZXJ2aWNlKCAgICdudWJTb3J0U2VydmljZScsICAgICByZXF1aXJlKCcuL3NvcnQtc2VydmljZScpKVxuICAgIC5maWx0ZXIoICAgICdudWJTb3J0QnknLCAgICAgICAgICByZXF1aXJlKCcuL3NvcnQtYnknKSlcbiAgICAuY29udHJvbGxlcignTnViU29ydENvbnRyb2xsZXInLCAgcmVxdWlyZSgnLi9zb3J0LWNvbnRyb2xsZXInKSlcbiAgICAuZGlyZWN0aXZlKCAnbnViU29ydCcsICAgICAgICAgICAgcmVxdWlyZSgnLi9zb3J0LWRpcmVjdGl2ZScpKVxuICAgIC5kaXJlY3RpdmUoICdudWJTb3J0Q29sJywgICAgICAgICByZXF1aXJlKCcuL3NvcnQtY29sLWRpcmVjdGl2ZScpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVNb2R1bGU7XG4iXX0=

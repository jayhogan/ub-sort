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

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

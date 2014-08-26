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

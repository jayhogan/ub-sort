var angular = window.angular;
var subModules = [
  require('./lib/sort')(angular).name
];

module.exports = angular.module('ng-utility-belt', subModules);

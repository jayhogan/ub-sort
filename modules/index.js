var angular = window.angular;
var subModules = [
  require('./sort/sort')(angular).name
];

module.exports = angular.module('ng-utility-belt', subModules);

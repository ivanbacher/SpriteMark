'use strict';

angular.module('bunnyMarkApp')
  .directive('ngThreejs', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function (scope, element, attrs) {

        /* parameters */
        var params = {};
        params.debug = attrs.debugMode || 'false';
        
        
        element.text('this is the ngThreejs directive');
      }
    };
  });
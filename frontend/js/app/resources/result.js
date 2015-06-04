(function(window, document, angular, undefined) {
	'use strict';

	var app = angular.module('codebreaker');
	app.factory('ResultRsc', ['$resource', function($resource) {
		return $resource('/result', null, {
			get: {
				method:'GET',
				isArray:true
			}
		});
	}]);
})(window, document, angular);
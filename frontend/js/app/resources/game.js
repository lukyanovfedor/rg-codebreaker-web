(function(window, document, angular, undefined) {
	'use strict';

	var app = angular.module('codebreaker');
	app.factory('GameRsc', ['$resource', function($resource) {
		return $resource('/game/:action/:data', null, {
			gues: {
				method: "GET",
				params: {
					action: "gues"
				}
			},
			hint: {
				method: "GET",
				params: {
					action: "hint"
				}
			}
		});
	}]);
})(window, document, angular);
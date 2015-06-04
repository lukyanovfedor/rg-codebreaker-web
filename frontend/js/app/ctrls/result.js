(function(window, document, angular, undefined) {
	'use strict';

	function ResultCtrl(result, $injector) {
		var vm = this;

		vm.result = result || [];

		vm.newGame = function() {
			$injector.get('$state').go('game', {}, { reload: true });
		};
	}

	var app = angular.module('codebreaker');
	app.controller('ResultCtrl', ['result', '$injector', ResultCtrl]);
})(window, document, window.angular);
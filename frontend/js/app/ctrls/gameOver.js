(function(window, document, angular, undefined) {
	'use strict';

	function GameOverCtrl(ResultRsc, $scope, GameOverModal, $injector) {
		var vm = this;

		vm.msg = $scope.status === "win" ? 'Congratulations you are won!' : 'Oops you are loosed ;(';
		vm.name = "";

		vm.startNew = function() {
			GameOverModal.deactivate();
			$injector.get('$state').go('game', {}, { reload: true });
		};

		vm.saveResult = function() {
			if (!vm.name) {
				return;
			}

			ResultRsc
				.save({name: vm.name})
				.$promise
				.then(function() {
					GameOverModal.deactivate();
					$injector.get('$state').go('results');
				});
		};
	}

	var app = angular.module('codebreaker');
	app.controller('GameOverCtrl', ['ResultRsc', '$scope', 'GameOverModal', '$injector', GameOverCtrl]);
})(window, document, window.angular);
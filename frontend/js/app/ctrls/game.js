(function(window, document, angular, undefined) {
	'use strict';

	function GameCtrl(game, GameRsc, GameOverModal) {
		var vm = this;

		vm.game = game || {};

		vm.code = {
			set: function(number) {
				var that = this;

				if (that.value.length >= 4) {
					return;
				}

				number = parseInt(number, 10);
				if (number < 1 || number > 6) {
					return;
				}

				that.value.push(number);

				if (that.value.length === 4) {
					GameRsc
						.gues({data: that.value.join("")})
						.$promise
						.then(function(data) {
							if (data.result === "++++") {
								return gameOver('win');
							}

							if (!data.attempts) {
								return gameOver('lose');
							}

							that.tries.push({
								attempt: that.value.join(""),
								result: data.result || "No matches"
							});

							that.value = [];

							that.attempts--;
						});
				}
			},
			remove: function() {
				if (this.value.length) {
					this.value.pop();
				}
			},
			value: [],
			attempts: vm.game.attempts || 0,
			tries: []
		};

		vm.hint = {
			get: function() {
				var that = this;

				if (!that.available) {
					return;
				}

				GameRsc
					.hint()
					.$promise
					.then(function(data) {
						if (data.result) {
							that.values.push(data.result);
						}

						that.available = data.hints;
					});
			},
			values: [],
			available: vm.game.hints || 0
		};

		var gameOver = function(status) {
			GameOverModal.activate({status: status});
		};
	}

	var app = angular.module('codebreaker');
	app.controller('GameCtrl', ['game', 'GameRsc', 'GameOverModal', GameCtrl]);
})(window, document, window.angular);
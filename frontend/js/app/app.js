(function(window, document, angular, undefined) {
	'use strict';

	var app = angular.module('codebreaker', ['ui.router', 'ngResource', 'btford.modal']);

	app.config(['$stateProvider',  '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('game', {
				url: '/',
				templateUrl: 'game.html',
				controller: 'GameCtrl',
				controllerAs: 'gm',
				resolve: {
					game: ['GameRsc', function(GameRsc) {
						return GameRsc.get({fresh: true}).$promise;
					}]
				}
			})
			.state('results', {
				url: '/results',
				templateUrl: 'results.html',
				controller: 'ResultCtrl',
				controllerAs: 'rs',
				resolve: {
					result: ['ResultRsc', function(ResultRsc) {
						return ResultRsc.get().$promise;
					}]
				}
			});

		$urlRouterProvider.otherwise('/');
	}]);

	app.config(['$httpProvider', function($httpProvider) {
		$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
		$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';

		$httpProvider.defaults.transformRequest = function(data) {
			var param = function(obj) {
				var query = '';
				var name, value, fullSubName, subValue, innerObj, i;

				for (name in obj) {
					value = obj[name];

					if (value instanceof Array) {
						for (i = 0; i < value.length; ++i) {
							subValue = value[i];
							fullSubName = name + '[' + i + ']';
							innerObj = {};
							innerObj[fullSubName] = subValue;
							query += param(innerObj) + '&';
						}
					} else if (value instanceof Object) {
						for (var subName in value) {
							subValue = value[subName];
							fullSubName = name + '[' + subName + ']';
							innerObj = {};
							innerObj[fullSubName] = subValue;
							query += param(innerObj) + '&';
						}
					} else if (value !== undefined && value !== null) {
						query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
					}
				}
				return query.length ? query.substr(0, query.length - 1) : query;
			};

			return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
		};
	}]);

	app.factory('GameOverModal', ['btfModal', function(btfModal) {
		return btfModal({
			controller: 'GameOverCtrl',
			controllerAs: 'go',
			templateUrl: 'game-over.html'
		});
	}]);
})(window, document, window.angular);
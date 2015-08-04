(function (angular, Favico) {
	'use strict';

	angular.module('Reader')
		.service('favicon', function () {
			var favico = new Favico({
				animation: 'none',
				type: 'rectangle'
			});

			return {
				badge: function (num) {
					favico.badge(num);
				},
				reset: function () {
					favico.reset();
				}
			};
		});

})(window.angular, window.Favico);

(function (angular) {
	'use strict';

	angular.module('Reader.ListResult').service('ListResult', function () {
		var results = [],
			current = 0,
			operations = {
				declare: function (input) {
					results = input;
				},
				remaining: function() {
					return (results.length > 0 ? results.length - 1 : 0) - current;
				},
				seek: function(index) {
					if (index >= 0 && index < results.length) {
						current = index;
					}
				},
				current: function () {
					if (results.length > 0) {
						return results[current];
					}
				},
				peek: function() {
					if (!operations.isEnd()) {
						return results[current + 1];
					}
				},
				next: function () {
					if (!operations.isEnd()) {
						return results[++current];
					}
				},
				previous: function () {
					if (!operations.isBeginning()) {
						return results[--current];
					}
				},
				isEnd: function () {
					return current >= results.length - 1;
				},
				isBeginning: function () {
					return current === 0;
				}
			};

		return operations;
	});

})(window.angular);

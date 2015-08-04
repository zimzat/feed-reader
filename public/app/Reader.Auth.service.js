(function (angular) {
	'use strict';

	angular.module('Reader')
		.run(function ($rootScope, $location) {
			$rootScope.$on('$locationChangeStart', function (event, newLocation) {
				if (newLocation.indexOf('login') === -1 && !localStorage.authToken) {
					event.preventDefault();
					$location.url('/login');
				}
			});
		})
		.service('AuthInterceptor', function ($q, $location) {
			var service = this;

			service.request = function (config) {
				if (localStorage.authToken) {
					config.headers.Authorization = 'Token ' + localStorage.authToken;
				}

				return config;
			};

			service.response = function (config) {
				if (config.headers('Authorization')) {
					localStorage.authToken = config.headers('Authorization');
				}

				return config;
			};

			service.responseError = function (response) {
				if (response.status === 401 && response.config.url.indexOf('login') === -1) {
					delete localStorage.authToken;
					$location.url('/login');
				}

				return $q.reject(response);
			};
		});

})(window.angular);

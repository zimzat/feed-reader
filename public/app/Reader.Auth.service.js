(function (angular) {
	'use strict';

	angular.module('Reader')
		.run(function ($rootScope, $location) {
			$rootScope.$on('$locationChangeStart', function (event, newLocation) {
				if (newLocation.indexOf('login') === -1 && !sessionStorage.authToken) {
					event.preventDefault();
					$location.url('/login');
				}
			});
		})
		.service('AuthInterceptor', function ($q, $location) {
			var service = this;

			service.request = function (config) {
				if (sessionStorage.authToken) {
					config.headers.Authorization = 'Token ' + sessionStorage.authToken;
				}

				return config;
			};

			service.response = function (config) {
				if (config.headers('Authorization')) {
					sessionStorage.authToken = config.headers('Authorization');
				}

				return config;
			};

			service.responseError = function (response) {
				if (response.status === 401 && response.config.url.indexOf('login') === -1) {
					delete sessionStorage.authToken;
					$location.url('/login');
				}

				return $q.reject(response);
			};
		});

})(window.angular);

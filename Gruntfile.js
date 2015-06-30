
module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			server: {
				options: {
					middleware: function (connect, options, middlewares) {
						middlewares.unshift(require('connect-modrewrite')(['!\\.html|\\.js|\\.svg|\\.css|\\.png$ /index.html [L]']));
						return middlewares;
					},
					livereload: true,
					base: 'public/',
					port: 9009,
					open: true
				}
			}
		},
		watch: {
			html: {
				files: ['public/index.html', 'public/app/**/*'],
				tasks: ['build'],
				options: {
					livereload: true
				}
			}
		},
		concat: {
			vendor: {
				src: [
					'node_modules/bootstrap/dist/css/bootstrap.css',
					'node_modules/bootstrap/dist/css/bootstrap-theme.css'
				],
				dest: 'public/vendor.css'
			},
			app: {
				src: [
					'public/app/**/*.css'
				],
				dest: 'public/app.css'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %> */\n'
			},
			vendor: {
				src: [
					'node_modules/angular/angular.js',
					'node_modules/angular-route/angular-route.js',
					'node_modules/angular-resource/angular-resource.js',
					'node_modules/angular-hotkeys/build/hotkeys.js'
				],
				dest: 'public/vendor.min.js'
			},
			app: {
				src: [
					'public/app/**/*.module.js',
					'public/app/**/*.js'
				],
				dest: 'public/app.min.js',
				options: {
					mangle: false,
					beautify: true,
					compress: {
						drop_debugger: false,
						drop_console: false
					}
				}
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', ['build']);
	grunt.registerTask('build', ['newer:uglify:vendor', 'newer:uglify:app', 'newer:concat:vendor', 'newer:concat:app']);
	grunt.registerTask('server', ['build', 'connect:server', 'watch']);

};

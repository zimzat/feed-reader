
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
				files: ['public/**/*'],
				tasks: ['build'],
				options: {
					livereload: true
				}
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %> */\n'
			},
			lib: {
				src: [
					'public/lib/angular.js',
					'public/lib/angular*.js',
					'node_modules/angular-hotkeys/build/hotkeys.min.js'
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
	grunt.registerTask('build', ['newer:uglify:lib', 'newer:uglify:app']);
	grunt.registerTask('server', ['build', 'connect:server', 'watch']);

};

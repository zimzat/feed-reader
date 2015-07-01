
module.exports = function (grunt) {

	grunt.config('env', grunt.option('env') || process.env.ENV || 'development');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		env: grunt.option('env') || process.env.ENV || 'dev',
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
		clean: {
			app: [
				'public/app.css',
				'public/app.min.js',
				'public/app.html.js'
			]
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
				banner: '/*! [<%= env %>] <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd hh:MM:ss") %> */\n'
			},
			vendor: {
				src: [
					'node_modules/angular/angular.js',
					'node_modules/angular-route/angular-route.js',
					'node_modules/angular-resource/angular-resource.js',
					'node_modules/angular-hotkeys/build/hotkeys.js',
					'node_modules/jquery/dist/jquery.js'
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
						global_defs: {
							APPLICATION_ENV: grunt.config('env')
						},
						drop_debugger: false,
						drop_console: false
					}
				}
			}
		},
		ngtemplates: {
			app: {
				cwd: 'public',
				src: 'app/**/*.html',
				dest: 'public/app.html.js',
				options: {
					module: 'Reader',
					htmlmin: {
						collapseWhitespace: true
					}
				}
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', ['clean', 'build']);
	grunt.registerTask('build', ['newer:uglify', 'newer:concat', 'ngtemplates']);
	grunt.registerTask('server', ['default', 'connect:server', 'watch']);

};

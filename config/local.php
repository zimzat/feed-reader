<?php

return [
	'user' => [
		'username' => 'zimzat',
		'password' => '$2y$10$t/I.IYpx7yBf.1dFqq4JwudpwHvBiwTGVsm.2d61SH.VokF5tPOQe',
	],
	'db' => [
		'dbname' => 'zimzat_reader',
		'user' => 'root',
		'password' => null,
		'host' => 'localhost',
		'driver' => 'pdo_mysql',
		'charset' => 'utf8',
		'driverOptions' => [
			\PDO::ATTR_EMULATE_PREPARES => false,
			\PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
			\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
		],
		'wrapperClass' => '\\Reader\\DbConnection',
		'profiler' => true,
	],
	'logger' => [
		new \Monolog\Handler\PHPConsoleHandler(),
		new \Monolog\Handler\ErrorLogHandler(),
		new \Monolog\Handler\StreamHandler('/tmp/php.error.log'),
	],
];

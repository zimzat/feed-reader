<?php

namespace Reader;

class Application {

	/** @var \Reader\Application */
	protected static $instance;

	/** @var \Monolog\Logger */
	public $log;

	/** @var \Reader\DbConnection */
	public $db;

	/** @var \Pux\Mux */
	public $router;

	public function __construct() {
		self::$instance = $this;
	}

	/** @return \Reader\Application */
	public static function getInstance() {
		if (empty(self::$instance)) {
			(new self())->bootstrap();
		}

		return self::$instance;
	}

	public function bootstrap() {
		$this->log = new \Monolog\Logger('');
		$this->log->pushHandler(new \Monolog\Handler\PHPConsoleHandler());
		$this->log->pushHandler(new \Monolog\Handler\ErrorLogHandler());
		$this->log->pushHandler(new \Monolog\Handler\StreamHandler('/tmp/php.error.log'));
		\PhpConsole\Connector::getInstance()->setSourcesBasePath(__DIR__);
		\Monolog\ErrorHandler::register($this->log);

		$config = new \Doctrine\DBAL\Configuration();
		$config->setSQLLogger(new \Doctrine\DBAL\Logging\DebugStack());
		$connectionParams = [
//			'dbname' => 'Reader',
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
		];
		$this->db = \Doctrine\DBAL\DriverManager::getConnection($connectionParams, $config);

		$this->router = new \Pux\Mux();
		$this->router->get('/api/category', '\\Reader\\Controller\\Category:main');
		$this->router->get('/api/category/:categoryId', '\\Reader\\Controller\\Category:get');
		$this->router->get('/api/category/:categoryId/feed', '\\Reader\\Controller\\Category:listFeed');
		$this->router->get('/api/category/:categoryId/entry', '\\Reader\\Controller\\Category:listEntry');
		$this->router->get('/api/category/:categoryId/entry/random', '\\Reader\\Controller\\Category:listEntryRandom');
		$this->router->get('/api/feed/:feedId/entry', '\\Reader\\Controller\\Entry:listFeed');
		$this->router->get('/api/feed/:feedId', '\\Reader\\Controller\\Feed:get');
		$this->router->get('/api/entry/:entryId', '\\Reader\\Controller\\Entry:get');
		$this->router->options('/api/entry/:entryId/read', __CLASS__ . ':options');
		$this->router->options('/api/entry/:entryId/marked', __CLASS__ . ':options');
		$this->router->post('/api/entry/:entryId/read', '\\Reader\\Controller\\Entry:setRead');
		$this->router->post('/api/entry/:entryId/marked', '\\Reader\\Controller\\Entry:setMarked');

		return $this;
	}

	public function options() {
		header('Access-Control-Request-Methods: OPTIONS, POST');
		header('Access-Control-Allow-Headers: Content-type');
	}

	public function run() {
		header('Access-Control-Allow-Origin: http://localhost:9009');
		try {
			$route = $this->router->dispatch($_SERVER['REQUEST_URI']);
			if (!$route) {
				http_response_code(404);
				return $this;
			}

			$route[3]['constructor_args'] = [$this];
			$return = \Pux\Executor::execute($route);

			if ($return !== null) {
				http_response_code(200);
				header('Content-type: application/json');
				echo json_encode($return);
			} else {
				http_response_code(204);
			}
		} catch (\Exception $e) {
			$this->log->error($e->getMessage(), ['exception' => $e]);
			http_response_code(500);
		}

		return $this;
	}
}

<?php

namespace Reader;

class Application {

	/** @var \Reader\Application */
	protected static $instance;

	/** @var array */
	public $config;

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
		ini_set('session.use_cookies', false);
		ini_set('session.cache_expire', 360);

		$env = (file_exists(__DIR__ . '/../config/env.php')) ? require __DIR__ . '/../config/env.php' : 'LOCAL';
		$configFile = __DIR__ . '/../config/' . strtolower($env) . '.php';
		if (!file_exists($configFile)) {
			throw new \Exception('Configuration file not found or incorrect application environment set.');
		}
		$this->config = require $configFile;
		$this->config['env'] = $env;

		$this->log = new \Monolog\Logger('', $this->config['logger']);
		\PhpConsole\Connector::getInstance()->setSourcesBasePath(__DIR__);
		\Monolog\ErrorHandler::register($this->log);

		$dbalConfiguration = new \Doctrine\DBAL\Configuration();
		if (!empty($this->config['db']['profiler'])) {
			$dbalConfiguration->setSQLLogger(new \Doctrine\DBAL\Logging\DebugStack());
		}
		$this->db = \Doctrine\DBAL\DriverManager::getConnection($this->config['db'], $dbalConfiguration);

		$this->router = new \Pux\Mux();
		foreach (require __DIR__ . '/../config/routes.php' as $route) {
			$this->router->{$route[0]}($route[1], '\\Reader\\Controller\\' . $route[2]);
		}

		return $this;
	}

	public function run() {
		$return = null;

		try {
			if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
				$this->doOptions();
			} else {
				$this->beforeRoute();
				$return = $this->doRoute();
				$this->afterRoute();
			}
		} catch (\Exception $e) {
			$this->log->error($e->getMessage(), ['exception' => $e]);
			if (http_response_code() === 200) {
				if ($e->getMessage() === 'Controller exception') {
					http_response_code(501);
				} else {
					http_response_code(500);
				}
			}
		}

		if ($return !== null) {
			header('Content-type: application/json');
			echo json_encode($return);
		} elseif (http_response_code() === 200) {
			http_response_code(204);
		}

		return $this;
	}

	protected function beforeRoute() {
		header('Access-Control-Allow-Origin: *');
		header('Access-Control-Expose-Headers: Authorization');

		$headers = apache_request_headers();
		if (!empty($headers['Authorization'])) {
			session_id(str_replace('Token ', '', $headers['Authorization']));
			session_start();
		}

		if (strpos($_SERVER['REQUEST_URI'], '/authentication/') === false && empty($_SESSION['user'])) {
			http_response_code(401);
			throw new \Exception('Unauthorized user');
		}
	}

	protected function doOptions() {
		$allowedMethods = ['POST', 'OPTIONS'];
		$allowedHeaders = ['Content-type', 'Authorization'];

		header('Access-Control-Allow-Origin: *');
		header('Access-Control-Request-Methods: ' . implode(', ', $allowedMethods));
		header('Access-Control-Allow-Headers: ' . implode(', ', $allowedHeaders));
	}

	protected function doRoute() {
		$route = $this->router->dispatch($_SERVER['REQUEST_URI']);
		if (!$route) {
			http_response_code(404);
			return;
		}

		$route[3]['constructor_args'] = [$this];
		return \Pux\Executor::execute($route);
	}

	protected function afterRoute() {
		if (session_status() === PHP_SESSION_ACTIVE) {
			header('Authorization: ' . session_id());
		}

		if ($this->db->getConfiguration()->getSQLLogger() instanceof \Doctrine\DBAL\Logging\DebugStack) {
			if ($this->db->getConfiguration()->getSQLLogger()->queries) {
				$this->log->debug('SQL', $this->db->getConfiguration()->getSQLLogger()->queries);
			}
		}
	}
}

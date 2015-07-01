<?php

namespace Reader\Controller;

class Authentication {
	/** @var \Reader\Application */
	protected $application;

	public function __construct(\Reader\Application $application) {
		$this->application = $application;
	}

	public function login() {
		$input = json_decode(file_get_contents('php://input'), true);

		$isValidUser = (
			isset($input['username'], $input['password'])
			&& $input['username'] === $this->application->config['user']['username']
			&& password_verify($input['password'], $this->application->config['user']['password'])
		);

		if ($isValidUser) {
			session_destroy();
			unset($_COOKIE[session_name()]);
			session_regenerate_id(true);
			session_start();
			$_SESSION = [
				'user' => true,
			];
		} else {
			http_response_code(401);
		}
	}

	public function logout() {
		session_destroy();
		unset($_COOKIE[session_name()]);
		session_regenerate_id(true);
		session_start();
		$_SESSION = [];
	}
}

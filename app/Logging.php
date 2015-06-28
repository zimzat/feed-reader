<?php

namespace Reader;

trait Logging {
	/** @return \Monolog\Logger */
	protected function log() {
		return Application::getInstance()->log;
	}
}

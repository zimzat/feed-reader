<?php

try {
	require realpath(__DIR__ . '/../vendor/autoload.php');
	$application = (new Reader\Application())->bootstrap();
	$application->run();
} catch (\Exception $e) {
	if (!empty($application->log)) {
		$application->log->critical($e->getMessage(), ['exception' => $e]);
	}
}

<?php

require __DIR__ . '/../vendor/autoload.php';

$application = (new Reader\Application())->bootstrap();
$feedUpdater = new Reader\FeedUpdater($application->db);
$feedUpdater->run();

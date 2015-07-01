<?php

require __DIR__ . '/../vendor/autoload.php';

$application = (new Reader\Application())->bootstrap();

$rows = $application->db->fetchAll('SELECT entryId, externalId FROM Entry');
foreach ($rows as $row) {
	$application->db->update(
		'Entry',
		['externalId' => hash('sha256', $row['externalId'])],
		['entryId' => $row['entryId']]
	);
}

<?php

echo 'Deprecated', "\n";
exit;

require __DIR__ . '/../vendor/autoload.php';

$application = (new Reader\Application())->bootstrap();

$entryId = 0;
do {
	$rows = $application->db->fetchAll("
		SELECT entryId, externalId
		FROM Entry
		WHERE externalId != ''
			AND entryId > ?
		ORDER BY entryId ASC
		LIMIT 1000
	", [$entryId]);
	foreach ($rows as $row) {
		$application->db->update(
			'Entry',
			['externalId' => hash('sha256', $row['externalId'])],
			['entryId' => $row['entryId']]
		);
		$entryId = $row['entryId'];
	}
	echo "\t", $entryId, "\n";
} while (count($rows) >= 1000);

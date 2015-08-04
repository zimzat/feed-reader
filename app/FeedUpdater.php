<?php

namespace Reader;

class FeedUpdater {
	use \Reader\Logging;

	/** @var \Reader\DbConnection */
	protected $db;

	public function __construct(DbConnection $db) {
		$this->db = $db;
	}

	public function run() {
		foreach ($this->getUpdatableFeeds() as $feed) {
			try {
				$this->log()->debug('Updating Feed: ' . $feed['feedId'] . ' ' . $feed['url']);

				$reader = new \PicoFeed\Reader\Reader;
				$resource = $reader->download($feed['url']);
				$parser = $reader->getParser(
					$resource->getUrl(),
					$resource->getContent(),
					$resource->getEncoding()
				);
				$externalFeed = $parser->execute();

				foreach ($externalFeed->getItems() as $item) {
					$this->upsertItem($feed['feedId'], $item);
				}
			} catch (\PicoFeed\PicoFeedException $e) {
				// FIXME: $this->db->update('Feed', ['lastError' => $e->getMessage()], ['feedId' => $feed['feedId']]);
				$this->log()->warning($e->getMessage(), ['exception' => $e]);
			}

			$this->db->update('Feed', ['dateChecked' => date('c')], ['feedId' => $feed['feedId']]);

			$this->log()->debug('Updated Feed: ' . $feed['feedId']);
		}
	}

	protected function getUpdatableFeeds() {
		$sql = "
			SELECT f.feedId, f.url
			FROM Feed AS f
			WHERE f.isEnabled
				AND f.dateChecked < ? - INTERVAL IF(f.frequency > 0, f.frequency, 30) MINUTE
			ORDER BY f.dateChecked ASC
		";
		return $this->db->executeQuery($sql, [date('c')])->fetchAll();
	}

	protected function upsertItem($feedId, \PicoFeed\Parser\Item $item) {
		$entryId = $this->db->executeQuery('SELECT entryId FROM Entry WHERE feedId = ? AND externalId = ?', [$feedId, $item->getId()])->fetchColumn();
		if ($entryId) {
			/* TEMPORARY FOR A FEW RUNS */
//			$this->db->update('Entry', [
//				'url' => $item->getUrl(),
//				'title' => $item->getTitle(),
//				'dateCreated' => $item->getDate()->format('c'),
//				'dateUpdated' => $item->getDate()->format('c'),
//			], [
//				'entryId' => $entryId,
//			]);
			/* TEMPORARY FOR A FEW RUNS */

			$contentHash = $this->db->executeQuery('SELECT MD5(UNCOMPRESS(EntryContent.content)) FROM EntryContent WHERE entryId = ? LIMIT 1', [$entryId])->fetchColumn();
			if ($contentHash === md5($item->getContent())) {
				return;
			}

			$this->log()->debug('Updating existing item: [' . $entryId . '] ' . $item->getId());

			$this->db->update('Entry', [
				'url' => $item->getUrl(),
				'title' => $item->getTitle(),
				'dateUpdated' => $item->getDate()->format('c'),
			], [
				'entryId' => $entryId,
			]);
			$this->db->update('EntryContent', [
				'content' => pack('L', strlen($item->getContent())) . gzcompress($item->getContent()),
				'dateUpdated' => $item->getDate()->format('c'),
			], [
				'entryId' => $entryId,
			]);

			return;
		}

		$this->log()->debug('Adding new item: ' . $item->getId());

		try {
			$this->db->transactional(function() use ($feedId, $item) {
				$this->db->insert('Entry', [
					'feedId' => $feedId,
					'externalId' => $item->getId(),
					'url' => $item->getUrl(),
					'title' => $item->getTitle(),
					'dateCreated' => $item->getDate()->format('c'),
					'dateUpdated' => $item->getDate()->format('c'),
				]);
				$entryId = $this->db->lastInsertId();
				$this->db->insert('EntryContent', [
					'entryId' => $entryId,
					'content' => pack('L', strlen($item->getContent())) . gzcompress($item->getContent()),
					'dateCreated' => $item->getDate()->format('c'),
					'dateUpdated' => $item->getDate()->format('c'),
				]);
			});
		} catch (\Exception $e) {
			$this->log()->warning($e->getMessage(), ['exception' => $e]);
		}
	}
}

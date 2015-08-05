<?php

namespace Reader;

class Repository {
	use \Reader\Logging;

	/** @var \Reader\DbConnection */
	protected $db;

	public function __construct(DbConnection $db) {
		$this->db = $db;
	}

	public function getCategories() {
		return $this->db->executeQuery('SELECT categoryId, title FROM Category ORDER BY title')->fetchAll();
	}

	public function upsertFeed(array $feed) {
		$this->db->upsert('Feed', 'feedId', array_intersect_key($feed, array_flip(['feedId', 'url', 'title', 'categoryId', 'frequency', 'isEnabled'])));
	}

	public function getUnreadRecent() {
		$sql = "
			SELECT COUNT(*) AS unreadCount
			FROM Entry AS e
				JOIN Feed AS f ON (f.feedId = e.feedId)
			WHERE e.isRead = false
				AND e.dateCreated >= ?
				AND f.categoryId != 10
		";
		return $this->db->executeQuery($sql, [date('c', strtotime('-48 hours'))])->fetchColumn();
	}

	public function getUnreadCategories() {
		$sql = "
			SELECT c.categoryId, c.title, COUNT(e.entryId) AS unreadCount
			FROM Category AS c
				JOIN Feed AS f USING (categoryId)
				JOIN Entry AS e USING (feedId)
			WHERE e.isRead = false
			GROUP BY c.categoryId
		";
		return $this->db->executeQuery($sql)->fetchAll();
	}

	public function getUnreadFeeds($categoryId) {
		$sql = "
			SELECT f.feedId, f.title, COUNT(e.entryId) AS unreadCount
			FROM Category AS c
				JOIN Feed AS f USING (categoryId)
				JOIN Entry AS e USING (feedId)
			WHERE e.isRead = false
				AND c.categoryId = ?
			GROUP BY f.feedId
			ORDER BY MAX(e.dateCreated) DESC
		";
		$bind = [$categoryId];
		return $this->db->executeQuery($sql, $bind)->fetchAll();
	}

	public function getUnreadEntries($categoryId=null, $feedId=null) {
		$sql = "
			SELECT e.entryId, c.title AS category, f.title AS feed, e.title
			FROM Category AS c
				JOIN Feed AS f USING (categoryId)
				JOIN Entry AS e USING (feedId)
			WHERE e.isRead = false
		";

		$bind = [];
		if ($categoryId) {
			$sql .= " AND f.categoryId = ? ";
			$bind[] = $categoryId;
		}
		if ($feedId) {
			$sql .= " AND f.feedId = ? ";
			$bind[] = $feedId;
		}
		if (!$feedId && !$categoryId) {
			$sql .= " AND e.dateCreated >= ? ";
			$sql .= " AND c.categoryId != 10 ";
			$bind[] = date('c', strtotime('-48 hours'));
		}

		$sql .= "
			ORDER BY e.dateCreated DESC, entryId ASC
			LIMIT 100
		";
		return $this->db->executeQuery($sql, $bind)->fetchAll();
	}

	public function getRandomEntries($categoryId=null, $feedId=null) {
		$sql = "
			SELECT entryId, title, feed, category
			FROM (
				SELECT
					e.entryId,
					e.title,
					f.title AS feed,
					c.title AS category,
					(DATEDIFF(NOW(), e.dateReadLast) + 1) * (1 + RAND() * IF(f.feedId = 134, 50, 75)) AS randWeight
				FROM Entry AS e
					JOIN Feed AS f USING (feedId)
					JOIN Category AS c USING (categoryId)
				WHERE e.isMarked = true
					AND e.dateCreated > ?
		";
		$bind = [date('c', strtotime('-5 months'))];
		
		if ($categoryId) {
			$sql .= " AND f.categoryId = ? ";
			$bind[] = $categoryId;
		}
		if ($feedId) {
			$sql .= " AND f.feedId = ? ";
			$bind[] = $feedId;
		}

		$sql .= "
				ORDER BY randWeight DESC
				LIMIT 100
			) AS tmp
		";

		return $this->db->executeQuery($sql, $bind)->fetchAll();
	}

	public function getEntry($entryId) {
		$sql = "
			SELECT e.*, UNCOMPRESS(ec.content) AS content
			FROM Entry AS e
				JOIN EntryContent AS ec USING (entryId)
			WHERE e.entryId = ?
		";
		$bind = [$entryId];
		return $this->db->executeQuery($sql, $bind)->fetch();
	}

	public function setEntryRead($entryId, $state=true) {
		if ($state) {
			$sql = "
				UPDATE Entry AS e
				SET e.isRead = true,
					e.dateReadLast = NOW()
				WHERE e.entryId = ?
			";
			$bind = [$entryId];
			return $this->db->executeUpdate($sql, $bind);
		} else {
			return $this->db->update('Entry', ['isRead' => false], ['entryId' => $entryId]);
		}
	}

	public function setEntryMarked($entryId, $state=true) {
		return $this->db->update('Entry', ['isMarked' => (bool)$state], ['entryId' => $entryId]);
	}
}

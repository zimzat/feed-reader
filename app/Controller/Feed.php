<?php

namespace Reader\Controller;

class Feed {
	/** @var \Reader\Application */
	protected $application;

	public function __construct(\Reader\Application $application) {
		$this->application = $application;
	}

	public function get($feedId) {
		return $this->application->db->select('Feed', ['feedId' => $feedId])->fetch();
	}

	public function upsert() {
		$repository = new \Reader\Repository($this->application->db);
		$repository->upsertFeed(json_decode(file_get_contents('php://input'), true));
	}
}

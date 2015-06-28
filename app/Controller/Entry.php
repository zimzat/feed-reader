<?php

namespace Reader\Controller;

class Entry {
	/** @var \Reader\Application */
	protected $application;
	public function __construct(\Reader\Application $application) {
		$this->application = $application;
	}

	public function get($entryId) {
		$repository = new \Reader\Repository($this->application->db);
		return $repository->getEntry($entryId);
	}

	public function listFeed($feedId) {
		$repository = new \Reader\Repository($this->application->db);
		return $repository->getUnreadEntries(null, $feedId);
	}

	public function setRead($entryId) {
		$repository = new \Reader\Repository($this->application->db);
		$repository->setEntryRead($entryId, (bool)json_decode(file_get_contents('php://input')));
	}

	public function setMarked($entryId) {
		$repository = new \Reader\Repository($this->application->db);
		$repository->setEntryMarked($entryId, (bool)json_decode(file_get_contents('php://input')));
	}
}

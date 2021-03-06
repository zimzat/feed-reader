<?php

namespace Reader\Controller;

class Category {
	/** @var \Reader\Application */
	protected $application;

	public function __construct(\Reader\Application $application) {
		$this->application = $application;
	}

	public function main() {
		$repository = new \Reader\Repository($this->application->db);
		return [
			'recent' => $repository->getUnreadRecent(),
			'categories' => $repository->getUnreadCategories(),
		];
	}

	public function get($categoryId) {
		if (!$categoryId) {
			return ['title' => 'Recent Entries', 'categoryId' => 0];
		}
		return $this->application->db->select('Category', ['categoryId' => $categoryId])->fetch();
	}

	public function search() {
		$repository = new \Reader\Repository($this->application->db);
		return $repository->getCategories();
	}

	public function listFeed($categoryId) {
		$repository = new \Reader\Repository($this->application->db);
		return $repository->getUnreadFeeds($categoryId);
	}

	public function listEntry($categoryId) {
		$repository = new \Reader\Repository($this->application->db);
		return $repository->getUnreadEntries($categoryId);
	}

	public function listEntryRandom($categoryId) {
		$repository = new \Reader\Repository($this->application->db);
		return $repository->getRandomEntries($categoryId);
	}
}

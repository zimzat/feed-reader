<?php

namespace Reader;

class DbConnection extends \Doctrine\DBAL\Connection {
	public function insert($tableExpression, array $data, array $types = array()) {
		parent::insert($this->quoteIdentifier($tableExpression), $this->quoteKeys($data), $this->quoteKeys($types));
	}

	public function update($tableExpression, array $data, array $identifier, array $types = array()) {
		parent::update($this->quoteIdentifier($tableExpression), $this->quoteKeys($data), $this->quoteKeys($identifier), $this->quoteKeys($types));
	}

	public function delete($tableExpression, array $data, array $types = array()) {
		parent::delete($this->quoteIdentifier($tableExpression), $this->quoteKeys($data), $this->quoteKeys($types));
	}

	public function select($tableExpression, array $identifier, array $types = array()) {
		$sql = 'SELECT * FROM ' . $this->quoteIdentifier($tableExpression) . ' WHERE ' . implode(' = ? AND ', array_keys($this->quoteKeys($identifier))) . ' = ?';
		return $this->executeQuery($sql, array_values($identifier), array_values($types));
	}

	public function upsert($tableExpression, $autoIncrementKey, array $data = array()) {
		$quotedIdentifiers = array_keys($this->quoteKeys($data));

		$update = [];
		foreach ($quotedIdentifiers as $key) {
			$update[] = $key . ' = VALUES(' . $key . ')';
		}

		$sql = 'INSERT INTO ' . $this->quoteIdentifier($tableExpression) . ' SET ' . implode(' = ? AND ', $quotedIdentifiers) . ' = ?'
			. ' ON DUPLICATE KEY UPDATE ' . $this->quoteIdentifier($autoIncrementKey) . ' = LAST_INSERT_ID(' . $this->quoteIdentifier($autoIncrementKey) . '), ' . implode(', ', $update);
		return $this->executeUpdate($sql, array_values($data));
	}

	protected function quoteKeys(array $data = array()) {
		$output = [];

		foreach ($data as $key => $value) {
			$output[$this->quoteIdentifier($key)] = $value;
		}

		return $output;
	}
}

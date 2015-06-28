
-- DROP DATABASE IF EXISTS `Reader`;
-- CREATE DATABASE `Reader`
-- 	CHARACTER SET utf8
-- 	COLLATE utf8_general_ci;
-- USE `Reader`;

CREATE TABLE Category (
	categoryId INTEGER UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(64) NOT NULL,
	dateCreated TIMESTAMP NOT NULL DEFAULT 0,
	dateUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE Feed (
	feedId INTEGER UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	categoryId INTEGER UNSIGNED,
	url VARCHAR(255) NOT NULL,
	title VARCHAR(64) NOT NULL,
	frequency INTEGER UNSIGNED NOT NULL,
	isEnabled BOOLEAN NOT NULL DEFAULT TRUE,
	dateChecked TIMESTAMP NOT NULL DEFAULT 0,
	dateCreated TIMESTAMP NOT NULL DEFAULT 0,
	dateUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (categoryId)
		REFERENCES Category (categoryId)
		ON UPDATE CASCADE
		ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE Entry (
	entryId INTEGER UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	feedId INTEGER UNSIGNED NOT NULL,
	externalId VARCHAR(255) NOT NULL,
	url VARCHAR(300) NOT NULL,
	title VARCHAR(64) NOT NULL,
	isRead BOOLEAN NOT NULL DEFAULT FALSE,
	isMarked BOOLEAN NOT NULL DEFAULT FALSE,
	dateReadLast TIMESTAMP NOT NULL DEFAULT 0,
	dateCreated TIMESTAMP NOT NULL DEFAULT 0,
	dateUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	INDEX (isMarked, feedId),
	INDEX (isRead, feedId),
	FOREIGN KEY (feedId)
		REFERENCES Feed (feedId)
		ON UPDATE CASCADE
		ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE EntryContent (
	entryContentId INTEGER UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
	entryId INTEGER UNSIGNED NOT NULL,
	content TEXT NOT NULL,
	dateCreated TIMESTAMP NOT NULL DEFAULT 0,
	dateUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (entryId)
		REFERENCES Entry (entryId)
		ON UPDATE CASCADE
		ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

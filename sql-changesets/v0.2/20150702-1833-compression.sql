
ALTER TABLE `EntryContent`
	CHANGE COLUMN `content` `content` BLOB NOT NULL;

UPDATE EntryContent
SET content = COMPRESS(content);

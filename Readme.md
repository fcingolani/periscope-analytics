# periscope-analytics

Dumps broadcasts, hearts, comments and users information to an SQLite database.


## Usage

0. Install

```
git clone https://github.com/fcingolani/periscope-analytics.git
cd periscope-analytics
npm install
```

1. Dump data

```
node ./bin/periscope-analytics.js import-recent-broadcasts username
```

2. Use SQL

You'll have an SQLite database in `data/database.sqlite` with a lot of information. Open it with your favorite SQLite client (i.e. https://sqlitebrowser.org/) and query whatever you want.

Here you have the DB schema in case you wonder how does it look like:

```
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `Users` (
	`id`	VARCHAR ( 255 ),
	`userName`	VARCHAR ( 255 ),
	`displayName`	VARCHAR ( 255 ),
	`profileImageURL`	TEXT,
	`locale`	VARCHAR ( 255 ),
	`vip`	VARCHAR ( 255 ),
	`verified`	TINYINT ( 1 ),
	`TwitterAccountId`	TEXT,
	PRIMARY KEY(`id`)
);
CREATE TABLE IF NOT EXISTS `UserLanguages` (
	`language`	VARCHAR ( 2 ) NOT NULL,
	`UserId`	VARCHAR ( 255 ) NOT NULL,
	PRIMARY KEY(`language`,`UserId`),
	FOREIGN KEY(`UserId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS `Messages` (
	`id`	VARCHAR ( 255 ),
	`type`	VARCHAR ( 255 ),
	`publishedAt`	DATETIME,
	`body`	TEXT,
	`BroadcastId`	VARCHAR ( 255 ),
	`UserId`	VARCHAR ( 255 ),
	FOREIGN KEY(`UserId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
	FOREIGN KEY(`BroadcastId`) REFERENCES `Broadcasts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
	PRIMARY KEY(`id`)
);
CREATE TABLE IF NOT EXISTS `Broadcasts` (
	`id`	VARCHAR ( 255 ),
	`state`	VARCHAR ( 255 ),
	`title`	TEXT,
	`language`	VARCHAR ( 255 ),
	`createdAt`	DATETIME,
	`updatedAt`	DATETIME,
	`startedAt`	DATETIME,
	`endedAt`	DATETIME,
	`pingedAt`	DATETIME,
	`timedoutAt`	DATETIME,
	`duration`	FLOAT,
	`locationDescription`	VARCHAR ( 255 ),
	`locationCity`	VARCHAR ( 255 ),
	`locationState`	VARCHAR ( 255 ),
	`locationCountry`	VARCHAR ( 255 ),
	`locationISOCode`	VARCHAR ( 255 ),
	`locationLat`	VARCHAR ( 255 ),
	`locationLng`	VARCHAR ( 255 ),
	`width`	INTEGER,
	`height`	INTEGER,
	`cameraRotation`	INTEGER,
	`is360`	TINYINT ( 1 ),
	`contentType`	VARCHAR ( 255 ),
	`source`	VARCHAR ( 255 ),
	`tweetId`	VARCHAR ( 255 ),
	`totalWatchedCount`	INTEGER,
	`totalCommentCount`	INTEGER,
	`totalHeartCount`	INTEGER,
	`UserId`	VARCHAR ( 255 ),
	FOREIGN KEY(`UserId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
	PRIMARY KEY(`id`)
);
CREATE TABLE IF NOT EXISTS `BroadcastTags` (
	`tag`	VARCHAR ( 255 ) NOT NULL,
	`BroadcastId`	VARCHAR ( 255 ) NOT NULL,
	FOREIGN KEY(`BroadcastId`) REFERENCES `Broadcasts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY(`tag`,`BroadcastId`)
);
CREATE UNIQUE INDEX IF NOT EXISTS `user_languages__user_id_language` ON `UserLanguages` (
	`UserId`,
	`language`
);
CREATE UNIQUE INDEX IF NOT EXISTS `broadcast_tags__broadcast_id_tag` ON `BroadcastTags` (
	`BroadcastId`,
	`tag`
);
COMMIT;
```

It's not well optimized, it lacks indexes, but it'll get you going.

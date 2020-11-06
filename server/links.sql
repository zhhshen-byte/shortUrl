
-- 建表
CREATE DATABASE mytest;

USE mytest;

CREATE TABLE `links` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `url` text,
  `keyword` varchar(10) DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  `insert_at` datetime DEFAULT NULL,
  `update_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
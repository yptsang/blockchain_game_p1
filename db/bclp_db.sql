-- MySQL dump 10.13  Distrib 5.5.62, for Win64 (AMD64)
--
-- Host: localhost    Database: bclp_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.6.5-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `game1_blocks`
--

DROP TABLE IF EXISTS `game1_blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game1_blocks` (
  `bid` tinyint(4) NOT NULL COMMENT 'block id',
  `sid` bigint(20) unsigned NOT NULL COMMENT 'sessions id',
  `cid` varchar(64) DEFAULT NULL COMMENT 'customer id',
  `pdid` varchar(64) DEFAULT NULL COMMENT 'product id',
  `pdq` int(11) DEFAULT NULL COMMENT 'product quantity',
  `pdn` varchar(64) DEFAULT NULL COMMENT 'product name',
  `dd` date DEFAULT NULL COMMENT 'delivery date',
  `nonce` int(11) DEFAULT NULL COMMENT 'value between 1 and 21',
  `ph` int(11) DEFAULT NULL COMMENT 'prev hash',
  `hash` int(11) NOT NULL,
  `cd` datetime DEFAULT NULL COMMENT 'created time & date of the block by the node',
  `isChained` tinyint(3) unsigned DEFAULT 0 COMMENT '0 = created  1 = chained  2 = failed',
  PRIMARY KEY (`bid`,`sid`),
  KEY `game1_blocks_FK` (`sid`),
  CONSTRAINT `game1_blocks_FK` FOREIGN KEY (`sid`) REFERENCES `game1_sessions` (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game1_blocks`
--

LOCK TABLES `game1_blocks` WRITE;
/*!40000 ALTER TABLE `game1_blocks` DISABLE KEYS */;
/*!40000 ALTER TABLE `game1_blocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game1_blocks_miners`
--

DROP TABLE IF EXISTS `game1_blocks_miners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game1_blocks_miners` (
  `sid` bigint(20) unsigned NOT NULL,
  `bid` tinyint(4) NOT NULL,
  `pbid` varchar(64) NOT NULL,
  PRIMARY KEY (`sid`,`bid`,`pbid`),
  KEY `game1_blocks_miners_FK` (`bid`,`sid`),
  KEY `game1_blocks_miners_FK_1` (`pbid`,`sid`),
  CONSTRAINT `game1_blocks_miners_FK` FOREIGN KEY (`bid`, `sid`) REFERENCES `game1_blocks` (`bid`, `sid`),
  CONSTRAINT `game1_blocks_miners_FK_1` FOREIGN KEY (`pbid`, `sid`) REFERENCES `game1_miners` (`pbid`, `sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game1_blocks_miners`
--

LOCK TABLES `game1_blocks_miners` WRITE;
/*!40000 ALTER TABLE `game1_blocks_miners` DISABLE KEYS */;
/*!40000 ALTER TABLE `game1_blocks_miners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game1_miners`
--

DROP TABLE IF EXISTS `game1_miners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game1_miners` (
  `pbid` varchar(64) NOT NULL COMMENT 'public id ( student id )',
  `pvid` int(11) NOT NULL COMMENT 'private id ( Random gen 6 digit numbers to Miners )',
  `sid` bigint(20) unsigned NOT NULL COMMENT 'session id',
  `points` int(10) unsigned NOT NULL DEFAULT 0,
  `socket_id` varchar(64) DEFAULT '0' COMMENT '0 = deactivate',
  PRIMARY KEY (`pbid`,`sid`),
  KEY `game1_miners_FK` (`sid`),
  CONSTRAINT `game1_miners_FK` FOREIGN KEY (`sid`) REFERENCES `game1_sessions` (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game1_miners`
--

LOCK TABLES `game1_miners` WRITE;
/*!40000 ALTER TABLE `game1_miners` DISABLE KEYS */;
/*!40000 ALTER TABLE `game1_miners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game1_miners_blocks`
--

DROP TABLE IF EXISTS `game1_miners_blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game1_miners_blocks` (
  `pbid` varchar(64) NOT NULL COMMENT 'public id ( student id )',
  `bid` tinyint(4) NOT NULL,
  `nonce` int(11) NOT NULL COMMENT 'student''s answer',
  `hash` int(11) NOT NULL COMMENT 'student''s answer',
  `sid` bigint(20) unsigned NOT NULL COMMENT 'session id',
  `votes` int(11) NOT NULL DEFAULT 0,
  `points` int(10) unsigned DEFAULT 0,
  `ad` datetime DEFAULT NULL COMMENT 'answer time',
  `correct` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `seq` int(11) DEFAULT 0 COMMENT 'sequence',
  PRIMARY KEY (`pbid`,`bid`,`sid`),
  KEY `game1_miners_blocks_FK` (`bid`,`sid`),
  KEY `game1_miners_blocks_FK_1` (`pbid`,`sid`),
  CONSTRAINT `game1_miners_blocks_FK` FOREIGN KEY (`bid`, `sid`) REFERENCES `game1_blocks` (`bid`, `sid`),
  CONSTRAINT `game1_miners_blocks_FK_1` FOREIGN KEY (`pbid`, `sid`) REFERENCES `game1_miners` (`pbid`, `sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game1_miners_blocks`
--

LOCK TABLES `game1_miners_blocks` WRITE;
/*!40000 ALTER TABLE `game1_miners_blocks` DISABLE KEYS */;
/*!40000 ALTER TABLE `game1_miners_blocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game1_sessions`
--

DROP TABLE IF EXISTS `game1_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game1_sessions` (
  `sid` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'session id',
  `passcode` varchar(16) NOT NULL,
  `tfbc` tinyint(3) unsigned NOT NULL COMMENT 'time for block creation',
  `tfbm` tinyint(3) unsigned NOT NULL COMMENT 'time for block mining',
  `tid` varchar(32) NOT NULL COMMENT 'teacher public id ( teacher id )',
  `pid` int(11) NOT NULL COMMENT 'private id',
  `game_end` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'ture = game ended',
  `start_date` datetime NOT NULL,
  PRIMARY KEY (`sid`),
  KEY `game1_sessions_FK` (`tid`),
  CONSTRAINT `game1_sessions_FK` FOREIGN KEY (`tid`) REFERENCES `teachers` (`tid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game1_sessions`
--

LOCK TABLES `game1_sessions` WRITE;
/*!40000 ALTER TABLE `game1_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `game1_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teachers` (
  `tid` varchar(32) NOT NULL,
  `pwd` varchar(64) NOT NULL COMMENT 'password',
  `socket_id` varchar(64) DEFAULT '0' COMMENT '0 = deactivate',
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
INSERT INTO `teachers` VALUES ('teacher01','Te@cher01','0'),('teacher02','Te@cher02','0'),('teacher03','Te@cher03','0'),('teacher04','Te@cher04','0'),('teacher05','Te@cher05','0');
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'bclp_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-01-02  8:38:44

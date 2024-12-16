# ************************************************************
# Sequel Ace SQL dump
# Version 20046
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: 127.0.0.1 (MySQL 8.0.31)
# Database: cinema-org
# Generation Time: 2023-02-12 19:04:31 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table auditoriums
# ------------------------------------------------------------

DROP TABLE IF EXISTS `auditoriums`;

CREATE TABLE `auditoriums` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_sv_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_sv_0900_ai_ci;



# Dump of table bookings
# ------------------------------------------------------------

DROP TABLE IF EXISTS `bookings`;

CREATE TABLE `bookings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `bookingNumber` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_sv_0900_ai_ci NOT NULL,
  `screeningId` int unsigned NOT NULL,
  `userId` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bookingNumber` (`bookingNumber`),
  KEY `screeningId` (`screeningId`),
  KEY `userId` (`userId`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`screeningId`) REFERENCES `screenings` (`id`),
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_sv_0900_ai_ci;



# Dump of table bookingsXseats
# ------------------------------------------------------------

DROP TABLE IF EXISTS `bookingsXseats`;

CREATE TABLE `bookingsXseats` (
  `bookingId` int unsigned NOT NULL,
  `seatId` int unsigned NOT NULL,
  `ticketTypeId` int unsigned NOT NULL,
  PRIMARY KEY (`bookingId`,`seatId`),
  KEY `seatId` (`seatId`),
  KEY `ticketTypeId` (`ticketTypeId`),
  CONSTRAINT `bookingsxseats_ibfk_1` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`),
  CONSTRAINT `bookingsxseats_ibfk_2` FOREIGN KEY (`seatId`) REFERENCES `seats` (`id`),
  CONSTRAINT `bookingsxseats_ibfk_3` FOREIGN KEY (`ticketTypeId`) REFERENCES `ticketTypes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_sv_0900_ai_ci;



# Dump of table categories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_sv_0900_ai_ci NOT NULL,
  `description` text COLLATE utf8mb4_sv_0900_ai_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_sv_0900_ai_ci;



# Dump of table movies
# ------------------------------------------------------------

DROP TABLE IF EXISTS `movies`;

CREATE TABLE `movies` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_sv_0900_ai_ci NOT NULL,
  `description` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_sv_0900_ai_ci;



# Dump of table moviesXcategories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `moviesXcategories`;

CREATE TABLE `moviesXcategories` (
  `movieId` int unsigned NOT NULL,
  `categoryId` int unsigned NOT NULL,
  PRIMARY KEY (`movieId`,`categoryId`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `moviesxcategories_ibfk_1` FOREIGN KEY (`movieId`) REFERENCES `movies` (`id`),
  CONSTRAINT `moviesxcategories_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_sv_0900_ai_ci;



# Dump of table screenings
# ------------------------------------------------------------

DROP TABLE IF EXISTS `screenings`;

CREATE TABLE `screenings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL,
  `movieId` int unsigned NOT NULL,
  `auditoriumId` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `movieId` (`movieId`),
  KEY `auditoriumId` (`auditoriumId`),
  CONSTRAINT `screenings_ibfk_1` FOREIGN KEY (`movieId`) REFERENCES `movies` (`id`),
  CONSTRAINT `screenings_ibfk_2` FOREIGN KEY (`auditoriumId`) REFERENCES `auditoriums` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_sv_0900_ai_ci;



# Dump of table seats
# ------------------------------------------------------------

DROP TABLE IF EXISTS `seats`;

CREATE TABLE `seats` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `rowNumber` int unsigned NOT NULL,
  `seatNumber` int unsigned NOT NULL,
  `auditoriumId` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rowNumber` (`rowNumber`,`seatNumber`,`auditoriumId`),
  KEY `auditoriumId` (`auditoriumId`),
  CONSTRAINT `seats_ibfk_1` FOREIGN KEY (`auditoriumId`) REFERENCES `auditoriums` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_sv_0900_ai_ci;



# Dump of table ticketTypes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ticketTypes`;

CREATE TABLE `ticketTypes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_sv_0900_ai_ci NOT NULL,
  `price` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_sv_0900_ai_ci;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(100) COLLATE utf8mb4_sv_0900_ai_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_sv_0900_ai_ci NOT NULL,
  `firstName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_sv_0900_ai_ci NOT NULL,
  `lastName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_sv_0900_ai_ci NOT NULL,
  `phoneNumber` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_sv_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_sv_0900_ai_ci;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

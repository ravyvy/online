-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 11, 2026 at 07:58 AM
-- Server version: 8.4.7
-- PHP Version: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `online`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`, `created_at`) VALUES
(1, 'ravyadmin', '$2a$12$38MBNk/qhXTkaTHrndyhm.xmQlJuYpSSmfjZDnsKHBbwWpvIy6Ooe', '2026-03-11 02:33:31'),
(2, 'ly', '$2a$18$MSf3IRHwNPKMjcvZwutLa.izd5Fg2Szx.510eo3XVbZEXwjsjUmYO', '2026-03-11 06:24:27');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` int DEFAULT NULL,
  `image` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `sizes` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category`, `price`, `image`, `description`, `sizes`, `created_at`) VALUES
(4, 'អាវយឺត', 'អាវ', 2, '1773210924009.jpg', '', '[\"s\", \"L\"]', '2026-03-11 06:35:24'),
(5, 'អាវយឺត', 'អាវ', 3, '1773210938823.jpg', '', '[\"S\", \"M\"]', '2026-03-11 06:35:38'),
(3, 'អាវយឺត', 'អាវ', 2, '1773210890241.webp', '', '[\"Free\"]', '2026-03-11 06:34:50'),
(6, 'អាវយឺត', 'អាវ', 4, '1773210955538.jpg', '', '[\"free\"]', '2026-03-11 06:35:55'),
(7, 'ខោ', 'ខោ', 7, '1773211229237.jpg', '', '[\"s\", \"L\"]', '2026-03-11 06:40:29'),
(8, 'ខោ', 'ខោ', 10, '1773211248498.jpg', '', '[\"S\", \"M\"]', '2026-03-11 06:40:48'),
(9, 'ខោ', 'ខោ', 7, '1773211262974.jpg', '', '[\"S\", \"M\", \"L\", \"XL\", \"2XL\"]', '2026-03-11 06:41:02'),
(10, 'ឆុត', 'រ៉ូប', 12, '1773211282358.jpg', '', '[\"s\", \"L\"]', '2026-03-11 06:41:22'),
(11, 'រ៉ូបទាន់សម័យ', 'រ៉ូប', 5, '1773211359289.jpg', '', '[\"S\", \"M\"]', '2026-03-11 06:42:39');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

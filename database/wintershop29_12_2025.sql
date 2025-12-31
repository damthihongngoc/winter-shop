-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: menshop
-- ------------------------------------------------------
-- Server version	8.0.43
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

/*!50503 SET NAMES utf8 */;

/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;

/*!40103 SET TIME_ZONE='+00:00' */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `banners`
--
DROP TABLE IF EXISTS `banners`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `banners` (
    `banner_id` int NOT NULL AUTO_INCREMENT,
    `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `title` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `status` enum ('active', 'inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`banner_id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--
LOCK TABLES `banners` WRITE;

/*!40000 ALTER TABLE `banners` DISABLE KEYS */;

INSERT INTO
  `banners`
VALUES
  (
    1,
    '/images/thumbnail-1763988734255.jpg',
    'banner 2',
    '/',
    'active',
    '2025-11-20 20:55:58'
  ),
  (
    2,
    '/images/thumbnail-1763988723182.jpg',
    'banner 1',
    '/',
    'active',
    '2025-11-20 20:58:54'
  ),
  (
    3,
    '/images/thumbnail-1763988747235.jpg',
    'anh 3',
    '/',
    'active',
    '2025-11-24 19:52:27'
  );

/*!40000 ALTER TABLE `banners` ENABLE KEYS */;

UNLOCK TABLES;

-- Table structure for table `categories`
DROP TABLE IF EXISTS `categories`;

CREATE TABLE
  categories (
    category_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    description TEXT COLLATE utf8mb4_unicode_ci,
    image VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (category_id)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

LOCK TABLES `categories` WRITE;

INSERT INTO
  `categories`
VALUES
  (
    1,
    'Áo thun',
    'Áo thun nam các loại',
    'https://theme.hstatic.net/200000690725/1001078549/14/home_category_8_img.jpg?v=1028',
    '2025-01-01 10:00:00'
  ),
  (
    2,
    'Áo len',
    'Áo len và áo nỉ nam',
    'https://theme.hstatic.net/200000690725/1001078549/14/home_category_2_img.jpg?v=1028',
    '2025-01-01 10:05:00'
  ),
  (
    3,
    'Áo sơ mi',
    'Áo sơ mi công sở và casual',
    'https://theme.hstatic.net/200000690725/1001078549/14/home_category_7_img.jpg?v=1028',
    '2025-01-01 10:10:00'
  ),
  (
    4,
    'Áo polo',
    'Áo polo thể thao và lịch sự',
    'https://theme.hstatic.net/200000690725/1001078549/14/home_category_5_img.jpg?v=1028',
    '2025-01-01 10:15:00'
  ),
  (
    5,
    'Áo khoác',
    'Áo khoác, áo gió, áo jacket',
    'https://theme.hstatic.net/200000690725/1001078549/14/home_category_1_img.jpg?v=1028',
    '2025-01-01 10:20:00'
  ),
  (
    6,
    'Quần dài',
    'Quần tây, quần kaki, quần jeans',
    'https://theme.hstatic.net/200000690725/1001078549/14/home_category_4_img.jpg?v=1028',
    '2025-01-01 10:25:00'
  ),
  (
    7,
    'Quần short',
    'Quần short thể thao và đi biển',
    'https://product.hstatic.net/200000690725/product/img_2738_54379360640_o_2ef9bbc9c89a40f193a722242e244b5f_master.jpg',
    '2025-01-01 10:30:00'
  ),
  (
    8,
    'Phụ kiện',
    'Mũ, nón, thắt lưng',
    'https://cdn.hstatic.net/products/200000690725/_dsc1894_54909154624_o_630ed8bba9234d7f8a2f8e2e08094012_master.jpg',
    '2025-01-01 10:35:00'
  );

UNLOCK TABLES;

-- Table structure for table `colors`
DROP TABLE IF EXISTS `colors`;

CREATE TABLE
  `colors` (
    `color_id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `hex_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`color_id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

LOCK TABLES `colors` WRITE;

INSERT INTO
  `colors`
VALUES
  (1, 'Trắng', '#FFFFFF'),
  (2, 'Đen', '#000000'),
  (3, 'Đỏ', '#FE0035'),
  (4, 'Xanh navy', '#000080'),
  (5, 'Xanh dương', '#0000FF'),
  (6, 'Xám', '#808080'),
  (7, 'Be', '#F5F5DC'),
  (8, 'Nâu', '#8B4513'),
  (9, 'Xanh lá', '#008000'),
  (10, 'Hồng', '#FFC0CB');

UNLOCK TABLES;

-- Table structure for table `sizes`
DROP TABLE IF EXISTS `sizes`;

CREATE TABLE
  `sizes` (
    `size_id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`size_id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

LOCK TABLES `sizes` WRITE;

INSERT INTO
  `sizes`
VALUES
  (1, 'S'),
  (2, 'M'),
  (3, 'L'),
  (4, 'XL'),
  (5, 'XXL');

UNLOCK TABLES;

-- Table structure for table `users`
DROP TABLE IF EXISTS `users`;

CREATE TABLE
  `users` (
    `user_id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `role` enum ('user', 'admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `email` (`email`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

LOCK TABLES `users` WRITE;

INSERT INTO
  `users`
VALUES
  (
    1,
    'Admin',
    'admin@menshop.com',
    '$2b$10$zADtXbpSfSCuX0tppNDvKenSHozb8LmIvmr9Tys97CiEO44bKUYqO',
    '0901234567',
    '123 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
    'admin',
    '2025-01-01 08:00:00',
    '2025-01-01 08:00:00'
  ),
  (
    2,
    'Nguyễn Văn A',
    'nguyenvana@gmail.com',
    '$2b$10$W8cd9IFfUYIwT5pSzGUqLOrVnuamJVWhs.UlDQMKuJHaVtluqMcxm',
    '0912345678',
    '45 Trần Duy Hưng, Cầu Giấy, Hà Nội',
    'user',
    '2025-01-05 10:00:00',
    '2025-01-05 10:00:00'
  ),
  (
    3,
    'Trần Thị B',
    'tranthib@gmail.com',
    '$2b$10$W8cd9IFfUYIwT5pSzGUqLOrVnuamJVWhs.UlDQMKuJHaVtluqMcxm',
    '0923456789',
    '78 Láng Hạ, Đống Đa, Hà Nội',
    'user',
    '2025-01-10 11:00:00',
    '2025-01-10 11:00:00'
  ),
  (
    4,
    'Lê Văn C',
    'levanc@gmail.com',
    '$2b$10$W8cd9IFfUYIwT5pSzGUqLOrVnuamJVWhs.UlDQMKuJHaVtluqMcxm',
    '0934567890',
    '12 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    'user',
    '2025-01-15 12:00:00',
    '2025-01-15 12:00:00'
  ),
  (
    5,
    'Phạm Thị D',
    'phamthid@gmail.com',
    '$2b$10$W8cd9IFfUYIwT5pSzGUqLOrVnuamJVWhs.UlDQMKuJHaVtluqMcxm',
    '0945678901',
    '34 Giải Phóng, Hai Bà Trưng, Hà Nội',
    'user',
    '2025-01-20 13:00:00',
    '2025-01-20 13:00:00'
  ),
  (
    6,
    'Hoàng Văn E',
    'hoangvane@gmail.com',
    '$2b$10$W8cd9IFfUYIwT5pSzGUqLOrVnuamJVWhs.UlDQMKuJHaVtluqMcxm',
    '0956789012',
    '56 Phạm Hùng, Nam Từ Liêm, Hà Nội',
    'user',
    '2025-01-25 14:00:00',
    '2025-01-25 14:00:00'
  ),
  (
    7,
    'Vũ Thị F',
    'vuthif@gmail.com',
    '$2b$10$W8cd9IFfUYIwT5pSzGUqLOrVnuamJVWhs.UlDQMKuJHaVtluqMcxm',
    '0967890123',
    '89 Lê Văn Lương, Thanh Xuân, Hà Nội',
    'user',
    '2025-02-01 15:00:00',
    '2025-02-01 15:00:00'
  ),
  (
    8,
    'Đặng Văn G',
    'dangvang@gmail.com',
    '$2b$10$W8cd9IFfUYIwT5pSzGUqLOrVnuamJVWhs.UlDQMKuJHaVtluqMcxm',
    '0978901234',
    '23 Tô Hiệu, Hà Đông, Hà Nội',
    'user',
    '2025-02-05 16:00:00',
    '2025-02-05 16:00:00'
  );

UNLOCK TABLES;

-- Table structure for table `products`
DROP TABLE IF EXISTS `products`;

CREATE TABLE
  `products` (
    `product_id` int NOT NULL AUTO_INCREMENT,
    `category_id` int NOT NULL,
    `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` text COLLATE utf8mb4_unicode_ci,
    `price` decimal(10, 2) NOT NULL DEFAULT '0.00',
    `thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `status` enum ('active', 'inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`product_id`),
    KEY `fk_products_category` (`category_id`),
    CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

LOCK TABLES `products` WRITE;

INSERT INTO
  `products`
VALUES
  (
    1,
    1,
    'Áo thun basic trơn',
    'Áo thun cotton 100% co giãn thoải mái',
    150000.00,
    '/images/image-1765027514569.jpg',
    'active',
    '2025-01-02 09:00:00'
  ),
  (
    2,
    1,
    'Áo thun có họa tiết',
    'Áo thun họa tiết trẻ trung năng động',
    180000.00,
    '/images/image-1765027514569.jpg',
    'active',
    '2025-01-03 09:00:00'
  ),
  (
    3,
    1,
    'Áo thun polo basic',
    'Áo thun polo lịch sự thanh lịch',
    220000.00,
    '/images/image-1765027514569.jpg',
    'active',
    '2025-01-04 09:00:00'
  ),
  (
    4,
    2,
    'Áo len cổ tròn',
    'Áo len dày dặn ấm áp mùa đông',
    450000.00,
    '/images/image-1765027514569.jpg',
    'active',
    '2025-01-05 09:00:00'
  ),
  (
    5,
    2,
    'Áo len cổ cao',
    'Áo len cao cấp giữ nhiệt tốt',
    520000.00,
    '/images/image-1765027514569.jpg',
    'active',
    '2025-01-06 09:00:00'
  ),
  (
    6,
    2,
    'Áo nỉ hoodie',
    'Áo nỉ hoodie phong cách street style',
    380000.00,
    '/images/image-1765027514569.jpg',
    'active',
    '2025-01-07 09:00:00'
  ),
  (
    7,
    3,
    'Áo sơ mi trắng công sở',
    'Áo sơ mi trắng form slim fit',
    280000.00,
    '/images/image-1765027514569.jpg',
    'active',
    '2025-01-08 09:00:00'
  ),
  (
    8,
    3,
    'Áo sơ mi kẻ sọc',
    'Áo sơ mi kẻ sọc tay dài',
    300000.00,
    '/images/image-1765027514569.jpg',
    'active',
    '2025-01-09 09:00:00'
  ),
  (
    9,
    3,
    'Áo sơ mi oxford',
    'Áo sơ mi oxford cao cấp',
    350000.00,
    '/images/image-1765027514569.jpg',
    'active',
    '2025-01-10 09:00:00'
  ),
  (
    10,
    4,
    'Áo polo trơn',
    'Áo polo cổ bẻ basic',
    250000.00,
    '/images/image-1765027514569.jpg',
    'active',
    '2025-01-11 09:00:00'
  ),
  (
    11,
    4,
    'Áo polo thể thao',
    'Áo polo vải thể thao thoáng mát',
    280000.00,
    '/images/image-1765027514569.jpg',
    'active',
    '2025-01-12 09:00:00'
  ),
  (
    12,
    5,
    'Áo khoác jeans',
    'Áo khoác jeans phong cách bụi',
    480000.00,
    '/images/image-1765027514569.jpg',
    'active',
    '2025-01-13 09:00:00'
  ),
  (
    13,
    5,
    'Áo khoác gió',
    'Áo khoác gió chống thấm nước',
    420000.00,
    '/images/image-1765027514569.jpg',
    'active',
    '2025-01-14 09:00:00'
  ),
  (
    14,
    5,
    'Áo jacket bomber',
    'Áo jacket bomber thời trang',
    550000.00,
    '/images/image-1765027514569.jpg',
    'active',
    '2025-01-15 09:00:00'
  ),
  (
    15,
    6,
    'Quần tây công sở',
    'Quần tây form chuẩn thanh lịch',
    380000.00,
    '/images/image-1765027514569.jpg',
    'active',
    '2025-01-16 09:00:00'
  ),
  (
    16,
    6,
    'Quần kaki slim fit',
    'Quần kaki ống côn hiện đại',
    350000.00,
    '/images/image-1765027514569.jpg',
    'active',
    '2025-01-17 09:00:00'
  ),
  (
    17,
    6,
    'Quần jeans đen',
    'Quần jeans đen basic',
    420000.00,
    '/images/image-1765027514569.jpg',
    'active',
    '2025-01-18 09:00:00'
  ),
  (
    18,
    6,
    'Quần jeans xanh nhạt',
    'Quần jeans xanh nhạt phong cách',
    450000.00,
    '/images/image-1765027514569.jpg',
    'active',
    '2025-01-19 09:00:00'
  ),
  (
    19,
    7,
    'Quần short thể thao',
    'Quần short tập gym, chạy bộ',
    180000.00,
    '/images/image-1765027514569.jpg',
    'active',
    '2025-01-20 09:00:00'
  ),
  (
    20,
    7,
    'Quần short kaki',
    'Quần short kaki đi chơi, du lịch',
    220000.00,
    '/images/image-1765027514569.jpg',
    'active',
    '2025-01-21 09:00:00'
  );

UNLOCK TABLES;

-- Table structure for table `product_details`
DROP TABLE IF EXISTS `product_details`;

CREATE TABLE
  `product_details` (
    `detail_id` int NOT NULL AUTO_INCREMENT,
    `product_id` int NOT NULL,
    `size_id` int NOT NULL,
    `color_id` int NOT NULL,
    `stock` int NOT NULL DEFAULT '0',
    `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `price` decimal(10, 2) DEFAULT NULL,
    PRIMARY KEY (`detail_id`),
    UNIQUE KEY `ux_product_size_color` (`product_id`, `size_id`, `color_id`),
    KEY `fk_pd_size` (`size_id`),
    KEY `fk_pd_color` (`color_id`),
    CONSTRAINT `fk_pd_color` FOREIGN KEY (`color_id`) REFERENCES `colors` (`color_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_pd_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_pd_size` FOREIGN KEY (`size_id`) REFERENCES `sizes` (`size_id`) ON DELETE RESTRICT ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

LOCK TABLES `product_details` WRITE;

INSERT INTO
  `product_details`
VALUES
  -- Áo thun basic (product_id=1)
  (
    1,
    1,
    1,
    1,
    50,
    '/images/image-1765027514569.jpg',
    150000.00
  ),
  (
    2,
    1,
    1,
    2,
    45,
    '/images/image-1765027514569.jpg',
    150000.00
  ),
  (
    3,
    1,
    2,
    1,
    60,
    '/images/image-1765027514569.jpg',
    150000.00
  ),
  (
    4,
    1,
    2,
    2,
    55,
    '/images/image-1765027514569.jpg',
    150000.00
  ),
  (
    5,
    1,
    3,
    1,
    40,
    '/images/image-1765027514569.jpg',
    150000.00
  ),
  (
    6,
    1,
    3,
    2,
    38,
    '/images/image-1765027514569.jpg',
    150000.00
  ),
  -- Áo thun họa tiết (product_id=2)
  (
    7,
    2,
    1,
    4,
    30,
    '/images/image-1765027514569.jpg',
    180000.00
  ),
  (
    8,
    2,
    2,
    4,
    35,
    '/images/image-1765027514569.jpg',
    180000.00
  ),
  (
    9,
    2,
    3,
    4,
    25,
    '/images/image-1765027514569.jpg',
    180000.00
  ),
  -- Áo len cổ tròn (product_id=4)
  (
    10,
    4,
    2,
    2,
    20,
    '/images/image-1765027514569.jpg',
    450000.00
  ),
  (
    11,
    4,
    2,
    6,
    18,
    '/images/image-1765027514569.jpg',
    450000.00
  ),
  (
    12,
    4,
    3,
    2,
    22,
    '/images/image-1765027514569.jpg',
    450000.00
  ),
  (
    13,
    4,
    3,
    6,
    20,
    '/images/image-1765027514569.jpg',
    450000.00
  ),
  (
    14,
    4,
    4,
    2,
    15,
    '/images/image-1765027514569.jpg',
    450000.00
  ),
  -- Áo sơ mi trắng (product_id=7)
  (
    15,
    7,
    2,
    1,
    40,
    '/images/image-1765027514569.jpg',
    280000.00
  ),
  (
    16,
    7,
    3,
    1,
    45,
    '/images/image-1765027514569.jpg',
    280000.00
  ),
  (
    17,
    7,
    4,
    1,
    35,
    '/images/image-1765027514569.jpg',
    280000.00
  ),
  -- Áo sơ mi kẻ sọc (product_id=8)
  (
    18,
    8,
    2,
    4,
    30,
    '/images/image-1765027514569.jpg',
    300000.00
  ),
  (
    19,
    8,
    3,
    4,
    32,
    '/images/image-1765027514569.jpg',
    300000.00
  ),
  (
    20,
    8,
    3,
    6,
    28,
    '/images/image-1765027514569.jpg',
    300000.00
  ),
  -- Áo polo (product_id=10)
  (
    21,
    10,
    2,
    2,
    35,
    '/images/image-1765027514569.jpg',
    250000.00
  ),
  (
    22,
    10,
    2,
    4,
    33,
    '/images/image-1765027514569.jpg',
    250000.00
  ),
  (
    23,
    10,
    3,
    2,
    30,
    '/images/image-1765027514569.jpg',
    250000.00
  ),
  (
    24,
    10,
    3,
    4,
    28,
    '/images/image-1765027514569.jpg',
    250000.00
  ),
  -- Áo khoác jeans (product_id=12)
  (
    25,
    12,
    2,
    5,
    15,
    '/images/image-1765027514569.jpg',
    480000.00
  ),
  (
    26,
    12,
    3,
    5,
    18,
    '/images/image-1765027514569.jpg',
    480000.00
  ),
  (
    27,
    12,
    4,
    5,
    12,
    '/images/image-1765027514569.jpg',
    480000.00
  ),
  -- Quần tây (product_id=15)
  (
    28,
    15,
    2,
    2,
    25,
    '/images/image-1765027514569.jpg',
    380000.00
  ),
  (
    29,
    15,
    2,
    6,
    23,
    '/images/image-1765027514569.jpg',
    380000.00
  ),
  (
    30,
    15,
    3,
    2,
    28,
    '/images/image-1765027514569.jpg',
    380000.00
  ),
  (
    31,
    15,
    3,
    6,
    26,
    '/images/image-1765027514569.jpg',
    380000.00
  ),
  -- Quần jeans (product_id=17)
  (
    32,
    17,
    2,
    2,
    30,
    '/images/image-1765027514569.jpg',
    420000.00
  ),
  (
    33,
    17,
    3,
    2,
    35,
    '/images/image-1765027514569.jpg',
    420000.00
  ),
  (
    34,
    17,
    4,
    2,
    28,
    '/images/image-1765027514569.jpg',
    420000.00
  ),
  -- Quần short (product_id=19)
  (
    35,
    19,
    2,
    2,
    40,
    '/images/image-1765027514569.jpg',
    180000.00
  ),
  (
    36,
    19,
    2,
    6,
    38,
    '/images/image-1765027514569.jpg',
    180000.00
  ),
  (
    37,
    19,
    3,
    2,
    35,
    '/images/image-1765027514569.jpg',
    180000.00
  );

UNLOCK TABLES;

-- Table structure for table `carts`
DROP TABLE IF EXISTS `carts`;

CREATE TABLE
  `carts` (
    `cart_id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`cart_id`),
    KEY `fk_carts_user` (`user_id`),
    CONSTRAINT `fk_carts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

LOCK TABLES `carts` WRITE;

INSERT INTO
  `carts`
VALUES
  (1, 2, '2025-02-01 10:00:00'),
  (2, 3, '2025-02-02 11:00:00'),
  (3, 4, '2025-02-03 12:00:00'),
  (4, 5, '2025-02-04 13:00:00');

UNLOCK TABLES;

-- Table structure for table `cart_items`
DROP TABLE IF EXISTS `cart_items`;

CREATE TABLE
  `cart_items` (
    `cart_item_id` int NOT NULL AUTO_INCREMENT,
    `cart_id` int NOT NULL,
    `detail_id` int NOT NULL,
    `quantity` int NOT NULL DEFAULT '1',
    PRIMARY KEY (`cart_item_id`),
    KEY `fk_ci_cart` (`cart_id`),
    KEY `fk_ci_detail` (`detail_id`),
    CONSTRAINT `fk_ci_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_ci_detail` FOREIGN KEY (`detail_id`) REFERENCES `product_details` (`detail_id`) ON DELETE RESTRICT ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

LOCK TABLES `cart_items` WRITE;

INSERT INTO
  `cart_items`
VALUES
  (1, 1, 1, 2),
  (2, 1, 15, 1),
  (3, 1, 21, 1),
  (4, 2, 7, 3),
  (5, 2, 28, 1),
  (6, 3, 10, 2),
  (7, 3, 32, 1),
  (8, 4, 18, 1),
  (9, 4, 25, 1);

UNLOCK TABLES;

-- Table structure for table `orders`
DROP TABLE IF EXISTS `orders`;

CREATE TABLE
  `orders` (
    `order_id` int NOT NULL AUTO_INCREMENT,
    `user_id` int DEFAULT NULL,
    `total_amount` decimal(10, 2) NOT NULL DEFAULT '0.00',
    `status` enum (
      'pending',
      'processing',
      'shipping',
      'received',
      'completed',
      'cancelled'
    ) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
    `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `shipping_name` varchar(100) DEFAULT NULL,
    `shipping_phone` varchar(20) DEFAULT NULL,
    `shipping_address` text DEFAULT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`order_id`),
    KEY `fk_orders_user` (`user_id`),
    CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

LOCK TABLES `orders` WRITE;

UNLOCK TABLES;

-- Table structure for table `order_details`
DROP TABLE IF EXISTS `order_details`;

CREATE TABLE
  `order_details` (
    `order_detail_id` int NOT NULL AUTO_INCREMENT,
    `order_id` int NOT NULL,
    `detail_id` int NOT NULL,
    `quantity` int NOT NULL DEFAULT '1',
    `price` decimal(10, 2) NOT NULL,
    PRIMARY KEY (`order_detail_id`),
    KEY `fk_od_order` (`order_id`),
    KEY `fk_od_detail` (`detail_id`),
    CONSTRAINT `fk_od_detail` FOREIGN KEY (`detail_id`) REFERENCES `product_details` (`detail_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_od_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

LOCK TABLES `order_details` WRITE;

UNLOCK TABLES;

-- Table structure for table `notifications`
DROP TABLE IF EXISTS `notifications`;

CREATE TABLE
  `notifications` (
    `notification_id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `title` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `message` text COLLATE utf8mb4_unicode_ci,
    `status` enum ('unread', 'read') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unread',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`notification_id`),
    KEY `fk_notifications_user` (`user_id`),
    CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

LOCK TABLES `notifications` WRITE;

UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
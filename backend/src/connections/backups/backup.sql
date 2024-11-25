-- Schema for table `attendance`
CREATE TABLE `attendance` (
  `attendance_id` int NOT NULL AUTO_INCREMENT,
  `student_id_code` varchar(255) NOT NULL,
  `timeIn` varchar(255) NOT NULL,
  `timeOut` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`attendance_id`)
) ENGINE=MyISAM AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for table `attendance`
INSERT INTO `attendance` VALUES ('101', '202020', '2024-10-02 00:26:47', '2024-10-02 00:28:14', 'Wed Oct 02 2024 00:26:47 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('63', 'Lakers23', '2024-09-02 22:30:04', '2024-09-02 22:30:20', 'Mon Sep 02 2024 22:30:04 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('83', '202020', '2024-09-04 20:59:00', 'n/a', 'Wed Sep 04 2024 20:59:00 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('64', '202020', '2024-09-02 22:30:14', '2024-09-02 22:30:35', 'Mon Sep 02 2024 22:30:14 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('82', '202020', '2024-09-04 20:58:21', 'n/a', 'Wed Sep 04 2024 20:58:21 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('70', '202020', '2024-09-02 23:03:02', '2024-09-02 23:03:47', 'Mon Sep 02 2024 23:03:02 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('71', '202020', '2024-09-03 23:03:08', 'n/a', 'Mon Sep 02 2024 23:03:08 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('73', '202020', '2024-09-04 04:21:31', '2024-09-04 04:21:40', 'Wed Sep 04 2024 04:21:31 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('74', '202020', '2024-09-04 04:25:37', '2024-09-04 04:25:41', 'Wed Sep 04 2024 04:25:37 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('75', '202020', '2024-09-04 04:33:49', '2024-09-04 04:34:17', 'Wed Sep 04 2024 04:33:49 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('100', '202020', '2024-09-06 10:12:33', '2024-09-06 10:12:41', 'Fri Sep 06 2024 10:12:33 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('99', '202020', '2024-09-06 00:25:34', 'n/a', 'Fri Sep 06 2024 00:25:34 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('93', '202020', '2024-09-05 14:05:20', '2024-09-05 14:05:56', 'Thu Sep 05 2024 14:05:20 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('98', '202020', '2024-09-05 16:28:50', 'n/a', 'Thu Sep 05 2024 16:28:50 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('91', '202020', '2024-09-04 21:53:43', '2024-09-04 21:53:52', 'Wed Sep 04 2024 21:53:43 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('102', '202020', '2024-10-21 00:45:53', '2024-10-21 00:46:02', 'Wed Oct 02 2024 00:45:53 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('103', '9090', '2024-10-02 00:52:57', '2024-10-02 00:53:15', 'Wed Oct 02 2024 00:52:57 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('104', '9090', '2024-10-02 01:08:49', '2024-10-02 01:08:58', 'Wed Oct 02 2024 01:08:49 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('105', '9090', '2024-10-02 01:15:04', '2024-10-02 01:15:12', 'Wed Oct 02 2024 01:15:04 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('106', '9090', '2024-10-02 01:16:31', 'n/a', 'Wed Oct 02 2024 01:16:31 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('107', '9090', '2024-10-02 01:17:31', '2024-10-02 01:18:13', 'Wed Oct 02 2024 01:17:31 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('108', '9090', '2024-10-02 01:18:38', 'n/a', 'Wed Oct 02 2024 01:18:38 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('109', '9090', '2024-10-02 01:29:40', '2024-10-02 01:29:46', 'Wed Oct 02 2024 01:29:40 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('110', '202020', '2024-11-22 12:41:12', '2024-11-22 12:41:53', 'Fri Nov 22 2024 12:41:12 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('111', 'Lakers23', '2024-11-22 14:10:30', '2024-11-22 14:10:42', 'Fri Nov 22 2024 14:10:30 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('112', 'Lakers23', '2024-11-22 14:10:56', 'n/a', 'Fri Nov 22 2024 14:10:56 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('113', 'Lakers23', '2024-11-25 01:10:59', 'n/a', 'Mon Nov 25 2024 01:10:59 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('114', 'Lakers23', '2024-11-25 02:33:47', 'n/a', 'Mon Nov 25 2024 02:33:47 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('115', 'Lakers23', '2024-11-25 02:40:06', 'n/a', 'Mon Nov 25 2024 02:40:06 GMT+0800 (Singapore Standard Time)');
INSERT INTO `attendance` VALUES ('116', 'Lakers23', '2024-11-25 02:40:57', '2024-11-25 02:41:03', 'Mon Nov 25 2024 02:40:57 GMT+0800 (Singapore Standard Time)');

-- Schema for table `deleted_records`
CREATE TABLE `deleted_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `table_name` varchar(255) NOT NULL,
  `deleted_data` json NOT NULL,
  `deleted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Schema for table `members`
CREATE TABLE `members` (
  `member_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `accessDuration` varchar(255) NOT NULL,
  `permissions` text NOT NULL,
  `created_at` date NOT NULL,
  PRIMARY KEY (`member_id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for table `members`
INSERT INTO `members` VALUES ('14', 'dasd', 'dasd', 'reydel', '24h', '["scan-qr-code","manage-student"]', 'Mon Nov 25 2024 00:00:00 GMT+0800 (Singapore Standard Time)');

-- Schema for table `messages`
CREATE TABLE `messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(255) NOT NULL,
  `recepientNumber` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `dateSent` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`message_id`)
) ENGINE=MyISAM AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for table `messages`
INSERT INTO `messages` VALUES ('1', '202020', '', 'Good day, Benidikto. Your student, Gottfried Leibniz, has ENTERED the school on Thursday, September 5, 2024 2:05 PM.', 'Thursday, September 5, 2024 2:05 PM');
INSERT INTO `messages` VALUES ('2', '202020', '', 'Good day, Benidikto. Your student, Gottfried Leibniz, has EXITED the school on Thursday, September 5, 2024 2:05 PM.', 'Thursday, September 5, 2024 2:05 PM');
INSERT INTO `messages` VALUES ('3', '202020', '2147483647', 'Good day, Benidikto. Your student, Gottfried Leibniz, has ENTERED the school on Thursday, September 5, 2024 4:28 PM.', 'Thursday, September 5, 2024 4:28 PM');
INSERT INTO `messages` VALUES ('4', '202020', '2147483647', 'Good day, Benidikto. Your student, Gottfried Leibniz, has ENTERED the school on Friday, September 6, 2024 12:25 AM.', 'Friday, September 6, 2024 12:25 AM');
INSERT INTO `messages` VALUES ('5', '202020', '2147483647', 'Good day, Benidikto. Your student, Gottfried Leibniz, has ENTERED the school on Friday, September 6, 2024 10:12 AM.', 'Friday, September 6, 2024 10:12 AM');
INSERT INTO `messages` VALUES ('6', '202020', '2147483647', 'Good day, Benidikto. Your student, Gottfried Leibniz, has EXITED the school on Friday, September 6, 2024 10:12 AM.', 'Friday, September 6, 2024 10:12 AM');
INSERT INTO `messages` VALUES ('7', '202020', '2147483647', 'Good day, Benidikto. Your student, Gottfried Leibniz, has ENTERED the school on Wednesday, October 2, 2024 12:26 AM.', 'Wednesday, October 2, 2024 12:26 AM');
INSERT INTO `messages` VALUES ('8', '202020', '2147483647', 'Good day, Benidikto. Your student, Gottfried Leibniz, has EXITED the school on Wednesday, October 2, 2024 12:28 AM.', 'Wednesday, October 2, 2024 12:28 AM');
INSERT INTO `messages` VALUES ('9', '202020', '2147483647', 'Good day, Benidikto. Your student, Gottfried Leibniz, has ENTERED the school on Wednesday, October 2, 2024 12:45 AM.', 'Wednesday, October 2, 2024 12:45 AM');
INSERT INTO `messages` VALUES ('10', '202020', '2147483647', 'Good day, Benidikto. Your student, Gottfried Leibniz, has EXITED the school on Wednesday, October 2, 2024 12:46 AM.', 'Wednesday, October 2, 2024 12:46 AM');
INSERT INTO `messages` VALUES ('11', '9090', '639097134971', 'Good day, Benidikto. Your student, TEST TESTT  , has ENTERED the school on Wednesday, October 2, 2024 12:52 AM.', 'Wednesday, October 2, 2024 12:52 AM');
INSERT INTO `messages` VALUES ('12', '9090', '639097134971', 'Good day, Benidikto. Your student, TEST TESTT  , has EXITED the school on Wednesday, October 2, 2024 12:53 AM.', 'Wednesday, October 2, 2024 12:53 AM');
INSERT INTO `messages` VALUES ('13', '9090', '639097134971', 'Good day, Benidikto. Your student, TEST TESTT  , has ENTERED the school on Wednesday, October 2, 2024 1:08 AM.', 'Wednesday, October 2, 2024 1:08 AM');
INSERT INTO `messages` VALUES ('14', '9090', '639097134971', 'Good day, Benidikto. Your student, TEST TESTT  , has EXITED the school on Wednesday, October 2, 2024 1:08 AM.', 'Wednesday, October 2, 2024 1:08 AM');
INSERT INTO `messages` VALUES ('15', '9090', '639097134971', 'Good day, Benidikto. Your student, TEST TESTT  , has ENTERED the school on Wednesday, October 2, 2024 1:15 AM.', 'Wednesday, October 2, 2024 1:15 AM');
INSERT INTO `messages` VALUES ('16', '9090', '639097134971', 'Good day, Benidikto. Your student, TEST TESTT  , has EXITED the school on Wednesday, October 2, 2024 1:15 AM.', 'Wednesday, October 2, 2024 1:15 AM');
INSERT INTO `messages` VALUES ('17', '9090', '639097134971', 'Good day, Benidikto. Your student, TEST TESTT  , has ENTERED the school on Wednesday, October 2, 2024 1:16 AM.', 'Wednesday, October 2, 2024 1:16 AM');
INSERT INTO `messages` VALUES ('18', '9090', '639097134971', 'Good day, Benidikto. Your student, TEST TESTT  , has ENTERED the school on Wednesday, October 2, 2024 1:17 AM.', 'Wednesday, October 2, 2024 1:17 AM');
INSERT INTO `messages` VALUES ('19', '9090', '639097134971', 'Good day, Benidikto. Your student, TEST TESTT  , has EXITED the school on Wednesday, October 2, 2024 1:18 AM.', 'Wednesday, October 2, 2024 1:18 AM');
INSERT INTO `messages` VALUES ('20', '9090', '639097134971', 'Good day, Benidikto. Your student, TEST TESTT  , has ENTERED the school on Wednesday, October 2, 2024 1:18 AM.', 'Wednesday, October 2, 2024 1:18 AM');
INSERT INTO `messages` VALUES ('21', '9090', '639097134971', 'Good day, Benidikto. Your student, TEST TESTT  , has ENTERED the school on Wednesday, October 2, 2024 1:29 AM.', 'Wednesday, October 2, 2024 1:29 AM');
INSERT INTO `messages` VALUES ('22', '9090', '639097134971', 'Good day, Benidikto. Your student, TEST TESTT  , has EXITED the school on Wednesday, October 2, 2024 1:29 AM.', 'Wednesday, October 2, 2024 1:29 AM');
INSERT INTO `messages` VALUES ('23', '202020', '2147483647', 'Good day, Benidikto. Your student, Gottfried Leibniz, has ENTERED the school on Friday, November 22, 2024 12:41 PM.', 'Friday, November 22, 2024 12:41 PM');
INSERT INTO `messages` VALUES ('24', '202020', '2147483647', 'Good day, Benidikto. Your student, Gottfried Leibniz, has EXITED the school on Friday, November 22, 2024 12:41 PM.', 'Friday, November 22, 2024 12:41 PM');
INSERT INTO `messages` VALUES ('25', 'Lakers23', '231321', 'Good day, Reydel. Your student, Lebron James Cabonegro, has ENTERED the school on Friday, November 22, 2024 2:10 PM.', 'Friday, November 22, 2024 2:10 PM');
INSERT INTO `messages` VALUES ('26', 'Lakers23', '231321', 'Good day, Reydel. Your student, Lebron James Cabonegro, has EXITED the school on Friday, November 22, 2024 2:10 PM.', 'Friday, November 22, 2024 2:10 PM');
INSERT INTO `messages` VALUES ('27', 'Lakers23', '231321', 'Good day, Reydel. Your student, Lebron James Cabonegro, has ENTERED the school on Friday, November 22, 2024 2:10 PM.', 'Friday, November 22, 2024 2:10 PM');
INSERT INTO `messages` VALUES ('28', 'Lakers23', '231321', 'Good day, Reydel. Your student, Lebron James Cabonegro, has ENTERED the school on Monday, November 25, 2024 1:10 AM.', 'Monday, November 25, 2024 1:10 AM');
INSERT INTO `messages` VALUES ('29', 'Lakers23', '231321', 'Good day, Reydel. Your student, Lebron James Cabonegro, has ENTERED the school on Monday, November 25, 2024 2:33 AM.', 'Monday, November 25, 2024 2:33 AM');
INSERT INTO `messages` VALUES ('30', 'Lakers23', '231321', 'Good day, Reydel. Your student, Lebron James Cabonegro, has ENTERED the school on Monday, November 25, 2024 2:40 AM.', 'Monday, November 25, 2024 2:40 AM');
INSERT INTO `messages` VALUES ('31', 'Lakers23', '231321', 'Good day, Reydel. Your student, Lebron James Cabonegro, has ENTERED the school on Monday, November 25, 2024 2:40 AM.', 'Monday, November 25, 2024 2:40 AM');
INSERT INTO `messages` VALUES ('32', 'Lakers23', '231321', 'Good day, Reydel. Your student, Lebron James Cabonegro, has EXITED the school on Monday, November 25, 2024 2:41 AM.', 'Monday, November 25, 2024 2:41 AM');

-- Schema for table `students`
CREATE TABLE `students` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `student_id_code` varchar(255) NOT NULL,
  `student_image_path` varchar(255) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `student_datebirth` varchar(255) NOT NULL,
  `student_address` varchar(255) NOT NULL,
  `student_gender` varchar(255) NOT NULL,
  `student_grade_level` varchar(255) NOT NULL,
  `student_program` varchar(255) NOT NULL,
  `student_block_section` varchar(255) NOT NULL,
  `student_parent_name` varchar(255) NOT NULL,
  `student_parent_number` varchar(255) NOT NULL,
  `student_parent_email` varchar(255) NOT NULL,
  `isArchive` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data for table `students`
INSERT INTO `students` VALUES ('9', 'Lakers23', 'uploads\1724988704995.png', 'Lebron James Cabonegro', '2024-08-29', 'Glamang Pol So cot', 'Male', 'Reydel', 'Reydel', 'Reydel', 'Reydel', '231321', 'reydel321@gmail.com', '0');
INSERT INTO `students` VALUES ('17', '202020', 'uploads\1725001363343.jpg', 'Gottfried Leibniz', '2024-08-29', 'Erfundene Straße 33', 'Female', '2nd', 'BSIT', '1', 'Benidikto', '2147483647', 'test@beispiel.de', '0');
INSERT INTO `students` VALUES ('24', 'Lakers23', 'uploads\1725591404295.png', 'Juan Francisco García Flores', '2024-09-25', 'C. Falsa 445', 'Male', '2nd', 'BSIT', '1', 'Benidikto', '2147483647', 'ejemplo@ejemplo.mx', '0');


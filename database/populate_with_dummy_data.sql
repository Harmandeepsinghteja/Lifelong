USE lifelong_db;
-- the password is the hashed version 1234
INSERT INTO users
VALUES (1,'charlie','$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW'),
	(2,'snoopy','$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW'),
	(3,'linus','$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW'),
	(4,'lucy','$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW'),
	(5,'john','$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW'),
	(6,'joe','$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW');

INSERT INTO bio 
VALUES (1,99,'Hardware Engineer','Male','Polynesian','Antarctica','Easter Island','Single','Casual Chat','Weekly','I love coding, reading sci-fi novels, and hiking. Big foodie here!'),
(2,28,'Software Developer','Nonbinary','Asian','Canada','India','Single','Casual Chat','Weekly','I love coding, reading sci-fi novels, and hiking. Big foodie here!'),
(3,30,'Hotdog vendor','Male','Polynesian','Antarctica','Easter Island','Single','Casual Chat','Weekly','I love coding, reading sci-fi novels, and hiking. Big foodie here!'),
(4,40,'Business Analyst','Female','Nigerian','Canada','Nigeria','Single','Casual Chat','Weekly','I love coding, reading sci-fi novels, and hiking. Big foodie here!'),
(5,50,'Carpenter','Male','South African','Antarctica','South Africa','Single','Casual Chat','Weekly','I love coding, reading sci-fi novels, and hiking. Big foodie here!');

INSERT INTO user_match
VALUES 
	(1, 1, 2, 'Shared Interests', '2023-10-11 06:10:00', NULL),
    (2, 2, 1, 'Shared Interests', '2023-10-11 06:10:00', NULL),
    
    (3, 1, 3, 'Proximity', '2023-10-12 06:10:00', '2023-10-13 06:10:00'),
    (4, 3, 1, 'Proximity', '2023-10-12 06:10:00', '2023-10-13 06:10:00'),
    
    (5, 2, 4, 'Similar Age', '2023-10-13 06:10:00', '2023-10-14 06:10:00'),
    (6, 4, 2, 'Similar Age', '2023-10-13 06:10:00', '2023-10-14 06:10:00');

INSERT INTO `message` 
VALUES 
	(1, 1, 'hello, this is a message from charlie','2024-11-03 19:55:33'),
	(2, 1 ,'another message from charlie','2024-11-03 19:56:08'),
	(3, 2, 'this is a message from snoopy','2024-11-03 19:57:44');
USE lifelong_db;

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;
-- Clear existing data
DELETE FROM users;
DELETE FROM bio;
DELETE FROM user_match;
DELETE FROM message;

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- the password is the hashed version 1234
INSERT INTO users
VALUES (1,'charlie', '$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW'),
	(2,'snoopy', '$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW'),
	(3,'linus', '$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW'),
	(4,'lucy', '$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW'),
	(5,'john', '$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW'),
	(6,'joe', '$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW'),
  (7, 'alice', '$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW'),
  (8, 'bob', '$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW'),
  (9, 'carol', '$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW'),
  (10, 'dave', '$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW'),
  (11, 'eve', '$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW'),
  (12, 'frank', '$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW'),
  (13, 'grace', '$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW'),
  (14, 'heidi', '$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW'),
  (15, 'ivan', '$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW'),
  (16, 'judy', '$2b$10$n/kx5u.k1xtNzokB752OseDHr2tWz6R2O1hn61LQHXtoAH0kUohZW');
  
INSERT INTO bio 
VALUES 
  (1,99,'Hardware Engineer','Male','African','Antarctica','Easter Island','Single','Casual Chat','Weekly','I love coding, reading sci-fi novels, and hiking. Big foodie here!'),
  (2,28,'Software Developer','Nonbinary','Asian','Canada','India','Single','Casual Chat','Weekly','I love coding, reading sci-fi novels, and hiking. Big foodie here!'),
  (3,30,'Hotdog vendor','Man','European','Antarctica','Easter Island','Single','Casual Chat','Weekly','I love coding, reading sci-fi novels, and hiking. Big foodie here!'),
  (4,40,'Business Analyst','Woman','Indegenous Peoples','Canada','Nigeria','Single','Casual Chat','Weekly','I love coding, reading sci-fi novels, and hiking. Big foodie here!'),
  (5,50,'Carpenter','Man','Latino/Hsipanic','Antarctica','South Africa','Single','Casual Chat','Weekly','I love coding, reading sci-fi novels, and hiking. Big foodie here!'),
  (7, 27, 'Teacher', 'Woman', 'Prefer not to say', 'Japan', 'Tokyo', 'Single', 'Letter', 'Weekly', 'I love teaching and mentoring.'),
  (8, 32, 'Doctor', 'Man', 'African', 'Germany', 'Germany', 'Married', 'Letter', 'Monthly', 'I am passionate about healthcare.'),
  (9, 26, 'Nurse', 'Woman', 'Asian', 'Nigeria', 'Ghana', 'Single', 'Letter', 'Daily', 'I enjoy caring for others.'),
  (10, 31, 'Lawyer', 'Man', 'European', 'Canada', 'China', 'Married', 'Casual Chat', 'Weekly', 'I love practicing law.'),
  (11, 23, 'Artist', 'Woman', 'Indegenous Peoples', 'Canada', 'France', 'Single', 'Casual Chat', 'Monthly', 'I am passionate about art and creativity.'),
  (12, 34, 'Chef', 'Man', 'Latino/Hsipanic', 'Spain', 'Croatia', 'Married', 'Casual Chat', 'Daily', 'I love cooking and experimenting with recipes.'),
  (13, 28, 'Photographer', 'Woman', 'Asian', 'South Korea', 'South Korea', 'Single', 'Casual Chat', 'Weekly', 'I enjoy capturing moments through photography.'),
  (14, 36, 'Writer', 'Man', 'European', 'Canada', 'Mexico', 'Married', 'Casual Chat', 'Monthly', 'I am passionate about writing and storytelling.'),
  (15, 27, 'Musician', 'Woman', 'African', 'Brazil', 'Canada', 'Single', 'Casual Chat', 'Daily', 'I love playing music and performing.'),
  (16, 29, 'Actor', 'Man', 'Asian', 'India', 'Canada', 'Single', 'Casual Chat', 'Weekly', 'I enjoy acting and being on stage.');

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
	(1, 1, 'Hello, this is a message from Charlie','2024-11-03 19:55:33'),
	(2, 1 ,'Another message from Charlie','2024-11-03 19:56:08'),
	(3, 2, 'This is a message from Snoopy','2024-11-03 19:57:44');

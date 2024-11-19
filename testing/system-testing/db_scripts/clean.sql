DROP DATABASE IF EXISTS lifelong_db;
CREATE DATABASE lifelong_db;
USE lifelong_db;

CREATE TABLE users (
    id int PRIMARY KEY AUTO_INCREMENT,
    username varchar(50) UNIQUE NOT NULL,
    password varchar(255) NOT NULL
);

CREATE TABLE bio (
    userId INT PRIMARY KEY,
    age INT NOT NULL,
    occupation VARCHAR(100) NOT NULL,
    gender VARCHAR(100) NOT NULL,
    ethnicity VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    homeCountry VARCHAR(100) NOT NULL,
    maritalStatus VARCHAR(100) NOT NULL,
    exchangeType VARCHAR(100) NOT NULL,
    messageFrequency VARCHAR(100) NOT NULL,
    bio VARCHAR(256) NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE user_match (
    id int PRIMARY KEY AUTO_INCREMENT,
    userId int NOT NULL,
    matchedUserId int NOT NULL,
    reason VARCHAR(1000),
    createdTime DATETIME NOT NULL,
    unmatchedTime DATETIME DEFAULT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (matchedUserId) REFERENCES users(id)
);

CREATE TABLE message (
    id INT PRIMARY KEY AUTO_INCREMENT,
    matchId INT NOT NULL,
    content TEXT NOT NULL,
    createdTime TIMESTAMP NOT NULL,
    FOREIGN KEY (matchId) REFERENCES user_match(id) 
);

INSERT INTO users
VALUES (1,'charlie', '$2b$10$C3moS8hp2/RmJoK6/O60KuYJWH/A2dO1O7CfZa2G9qJU/jNJstvwy'),
	(2,'snoopy', '$2b$10$C3moS8hp2/RmJoK6/O60KuYJWH/A2dO1O7CfZa2G9qJU/jNJstvwy'),
	(3,'linus', '$2b$10$C3moS8hp2/RmJoK6/O60KuYJWH/A2dO1O7CfZa2G9qJU/jNJstvwy'),
	(4,'lucy', '$2b$10$C3moS8hp2/RmJoK6/O60KuYJWH/A2dO1O7CfZa2G9qJU/jNJstvwy'),
	(5,'john', '$2b$10$C3moS8hp2/RmJoK6/O60KuYJWH/A2dO1O7CfZa2G9qJU/jNJstvwy'),
	(6,'joe', '$2b$10$C3moS8hp2/RmJoK6/O60KuYJWH/A2dO1O7CfZa2G9qJU/jNJstvwy'),
  (7, 'alice', '$2b$10$C3moS8hp2/RmJoK6/O60KuYJWH/A2dO1O7CfZa2G9qJU/jNJstvwy'),
  (8, 'bob', '$2b$10$C3moS8hp2/RmJoK6/O60KuYJWH/A2dO1O7CfZa2G9qJU/jNJstvwy'),
  (9, 'carol', '$2b$10$C3moS8hp2/RmJoK6/O60KuYJWH/A2dO1O7CfZa2G9qJU/jNJstvwy'),
  (10, 'dave', '$2b$10$C3moS8hp2/RmJoK6/O60KuYJWH/A2dO1O7CfZa2G9qJU/jNJstvwy'),
  (11, 'eve', '$2b$10$C3moS8hp2/RmJoK6/O60KuYJWH/A2dO1O7CfZa2G9qJU/jNJstvwy'),
  (12, 'frank', '$2b$10$C3moS8hp2/RmJoK6/O60KuYJWH/A2dO1O7CfZa2G9qJU/jNJstvwy'),
  (13, 'grace', '$2b$10$C3moS8hp2/RmJoK6/O60KuYJWH/A2dO1O7CfZa2G9qJU/jNJstvwy'),
  (14, 'heidi', '$2b$10$C3moS8hp2/RmJoK6/O60KuYJWH/A2dO1O7CfZa2G9qJU/jNJstvwy'),
  (15, 'ivan', '$2b$10$C3moS8hp2/RmJoK6/O60KuYJWH/A2dO1O7CfZa2G9qJU/jNJstvwy'),
  (16, 'judy', '$2b$10$C3moS8hp2/RmJoK6/O60KuYJWH/A2dO1O7CfZa2G9qJU/jNJstvwy');

INSERT INTO bio 
VALUES   (1,99,'Hardware Engineer','Male','Polynesian','Antarctica','Easter Island','Single','Casual Chat','Weekly','I love coding, reading sci-fi novels, and hiking. Big foodie here!'),
  (2,28,'Software Developer','Nonbinary','Asian','Canada','India','Single','Casual Chat','Weekly','I love coding, reading sci-fi novels, and hiking. Big foodie here!'),
  (3,30,'Hotdog vendor','Male','Polynesian','Antarctica','Easter Island','Single','Casual Chat','Weekly','I love coding, reading sci-fi novels, and hiking. Big foodie here!'),
  (4,40,'Business Analyst','Female','Nigerian','Canada','Nigeria','Single','Casual Chat','Weekly','I love coding, reading sci-fi novels, and hiking. Big foodie here!'),
  (5,50,'Carpenter','Male','South African','Antarctica','South Africa','Single','Casual Chat','Weekly','I love coding, reading sci-fi novels, and hiking. Big foodie here!'),
  (7, 27, 'Teacher', 'Female', 'Asian', 'Japan', 'Tokyo', 'Single', 'Friendship', 'Weekly', 'I love teaching and mentoring.'),
  (8, 32, 'Doctor', 'Male', 'Caucasian', 'Germany', 'Berlin', 'Married', 'Business', 'Monthly', 'I am passionate about healthcare.'),
  (9, 26, 'Nurse', 'Female', 'African', 'Nigeria', 'Lagos', 'Single', 'Dating', 'Daily', 'I enjoy caring for others.'),
  (10, 31, 'Lawyer', 'Male', 'Asian', 'China', 'Beijing', 'Married', 'Networking', 'Weekly', 'I love practicing law.'),
  (11, 23, 'Artist', 'Female', 'Caucasian', 'France', 'Paris', 'Single', 'Friendship', 'Monthly', 'I am passionate about art and creativity.'),
  (12, 34, 'Chef', 'Male', 'Hispanic', 'Spain', 'Madrid', 'Married', 'Business', 'Daily', 'I love cooking and experimenting with recipes.'),
  (13, 28, 'Photographer', 'Female', 'Asian', 'South Korea', 'Seoul', 'Single', 'Dating', 'Weekly', 'I enjoy capturing moments through photography.'),
  (14, 36, 'Writer', 'Male', 'Caucasian', 'USA', 'Los Angeles', 'Married', 'Networking', 'Monthly', 'I am passionate about writing and storytelling.'),
  (15, 27, 'Musician', 'Female', 'African', 'Brazil', 'Rio de Janeiro', 'Single', 'Friendship', 'Daily', 'I love playing music and performing.'),
  (16, 29, 'Actor', 'Male', 'Asian', 'India', 'Delhi', 'Single', 'Dating', 'Weekly', 'I enjoy acting and being on stage.');

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
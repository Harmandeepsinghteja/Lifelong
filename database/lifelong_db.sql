CREATE DATABASE IF NOT EXISTS lifelong_db;
USE lifelong_db;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id int PRIMARY KEY AUTO_INCREMENT,
  username varchar(50) UNIQUE NOT NULL,
  password varchar(50) NOT NULL
);

DROP TABLE IF EXISTS bio;

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

DROP TABLE IF EXISTS matches;

CREATE TABLE matches (
  id int PRIMARY KEY AUTO_INCREMENT,
  createdTime TIMESTAMP NOT NULL,
  unmatchedTime TIMESTAMP DEFAULT NULL
);

DROP TABLE IF EXISTS user_match;

CREATE TABLE user_match (
  userId int,
  matchId int,
  PRIMARY KEY (userId, matchId),
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (matchId) REFERENCES matches(id)\
);


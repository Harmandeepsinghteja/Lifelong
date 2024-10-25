CREATE DATABASE IF NOT EXISTS lifelong_db;
USE lifelong_db;

DROP TABLE IF EXISTS match;

CREATE TABLE user_match (
  id int PRIMARY KEY AUTO_INCREMENT,
  createdTime TIMESTAMP NOT NULL,
  unmatchedTime TIMESTAMP DEFAULT NULL
);

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id int PRIMARY KEY AUTO_INCREMENT,
  username varchar(50) UNIQUE NOT NULL,
  password varchar(50) NOT NULL,
  matchId int DEFAULT NULL,
  FOREIGN KEY (matchId) REFERENCES match(id);
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


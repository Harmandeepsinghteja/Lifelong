DROP DATABASE IF EXISTS lifelong_db;
CREATE DATABASE lifelong_db;
USE lifelong_db;

CREATE TABLE users (
    id int PRIMARY KEY AUTO_INCREMENT,
    username varchar(50) UNIQUE NOT NULL,
    password varchar(50) NOT NULL
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

-- DROP TABLE IF EXISTS user_match;

-- CREATE TABLE user_match (
--   userId int,
--   matchId int,
--   PRIMARY KEY (userId, matchId),
--   FOREIGN KEY (userId) REFERENCES users(id),
--   FOREIGN KEY (matchId) REFERENCES matches(id);
-- );

-- DROP TABLE IF EXISTS matches;

-- CREATE TABLE matches (
--   id int PRIMARY KEY AUTO_INCREMENT,
--   createdTime TIMESTAMP NOT NULL,
--   unmatchedTime TIMESTAMP DEFAULT NULL
-- );



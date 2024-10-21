CREATE DATABASE IF NOT EXISTS lifelong_db;
USE lifelong_db;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id int PRIMARY KEY AUTO_INCREMENT,
  email varchar(50) UNIQUE NOT NULL,
  username varchar(50) UNIQUE NOT NULL,
  password varchar(50) NOT NULL,
);


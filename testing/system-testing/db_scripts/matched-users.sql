USE lifelong_db;

INSERT INTO users
VALUES(1000, 'TestUser', 'TU_123'),
(1001, 'TestMatchedUser', 'TMU_123');

INSERT INTO bio VALUES
(1000, 23, 'Farmer', 'Man', 'Prefer not to say', 'Canada', 'China', 'Married', 'Letter', 'Weekly', "I have a cat."),
(1001, 23, 'Cook', 'Woman', 'Prefer not to say', 'Canada', 'China', 'Married', 'Letter', 'Weekly', "I have a cat.");

INSERT into user_match VALUES 
(1000, 1000, 1001, 'Shared Interests', '2024-10-11 06:10:00', NULL),
(1001, 1001, 1000, 'Shared Interests', '2024-10-11 06:10:00', NULL);
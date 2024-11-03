USE lifelong_db;

INSERT INTO users
VALUES (1,'charlie','1234'),
	(2,'snoopy','1234'),
	(3,'linus','1234'),
	(4,'lucy','1234'),
	(5,'john','1234'),
	(6,'joe','1234');

INSERT INTO bio 
VALUES (1,99,'Hardware Engineer','Male','Polynesian','Antarctica','Easter Island','Single','Casual Chat','Weekly','I love coding, reading sci-fi novels, and hiking. Big foodie here!'),
(2,28,'Software Developer','Nonbinary','Asian','Canada','India','Single','Casual Chat','Weekly','I love coding, reading sci-fi novels, and hiking. Big foodie here!'),
(3,30,'Hotdog vendor','Male','Polynesian','Antarctica','Easter Island','Single','Casual Chat','Weekly','I love coding, reading sci-fi novels, and hiking. Big foodie here!'),
(4,40,'Business Analyst','Female','Nigerian','Canada','Nigeria','Single','Casual Chat','Weekly','I love coding, reading sci-fi novels, and hiking. Big foodie here!'),
(5,50,'Carpenter','Male','South African','Antarctica','South Africa','Single','Casual Chat','Weekly','I love coding, reading sci-fi novels, and hiking. Big foodie here!');

INSERT INTO user_match (userId, matchedUserId, createdTime, unmatchedTime)
VALUES 
	(1, 2, '2023-10-11 06:10:00', NULL),
    (2, 1,'2023-10-11 06:10:00', NULL),
    
    (1, 3, '2023-10-12 06:10:00', '2023-10-13 06:10:00'),
    (3, 1, '2023-10-12 06:10:00', '2023-10-13 06:10:00'),
    
    (2, 4, '2023-10-13 06:10:00', '2023-10-14 06:10:00'),
    (4, 2, '2023-10-13 06:10:00', '2023-10-14 06:10:00');
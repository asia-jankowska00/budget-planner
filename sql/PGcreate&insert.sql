-- ********* CREATING TABLES *********

-- DROP DATABASE bp;

-- CREATE DATABASE bp
--     WITH 
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'English_Denmark.1252'
--     LC_CTYPE = 'English_Denmark.1252'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1;

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- creating currency table
CREATE TABLE bpCurrency( 
    CurrencyId SERIAL PRIMARY KEY,
    CurrencyCode VARCHAR (3) NOT NULL,
    CurrencyName VARCHAR (255) NOT NULL,
    CurrencySymbol VARCHAR (50) NOT NULL
);

-- creating user table
CREATE TABLE bpUser( 
    UserId SERIAL PRIMARY KEY,
    UserFirstName VARCHAR (255) NOT NULL,
    UserLastName VARCHAR (255) NOT NULL,
    UserIsDisabled BOOLEAN,

    CurrencyId INT NOT NULL,

    FOREIGN KEY (CurrencyId) REFERENCES bpCurrency(CurrencyId)
);

CREATE TABLE bpLogin(
    LoginId SERIAL PRIMARY KEY,
    LoginUsername VARCHAR (255) NOT NULL,
    LoginPassword VARCHAR (255) NOT NULL,

    UserId INT NOT NULL,

    CONSTRAINT LoginUser FOREIGN KEY(UserId) REFERENCES bpUser(UserId)
);

-- creating source table
-- user owns source
-- currency can be used in source
CREATE TABLE bpSource(
    SourceId SERIAL PRIMARY KEY,
    SourceName VARCHAR (255) NOT NULL,
    SourceDescription VARCHAR(255),
    SourceAmount MONEY NOT NULL, --come back, money format
     -- currency VARCHAR (50) NOT NULL,

    UserId INT,
    CurrencyId INT,

    FOREIGN KEY(UserId) REFERENCES bpUser(UserId),
    FOREIGN KEY(CurrencyId) REFERENCES bpCurrency(CurrencyId)
);

--creating container table
-- user owns container
CREATE TABLE bpContainer(
    ContainerId SERIAL PRIMARY KEY,
    ContainerName VARCHAR (255) NOT NULL,

    UserId SERIAL NOT NULL,

    FOREIGN KEY(UserId) REFERENCES bpUser(UserId)
);

-- creating user has access to container
CREATE TABLE bpUserContainer(
    UserContainerId SERIAL PRIMARY KEY,
    UserId INT NOT NULL,
    ContainerId INT NOT NULL,

    CONSTRAINT UserContainer UNIQUE(
        UserId,
        ContainerId
    ),

    FOREIGN KEY(UserId) REFERENCES bpUser(UserId),
    FOREIGN KEY(ContainerId) REFERENCES bpContainer(ContainerId)
);

-- creating container includes source
CREATE TABLE bpSourceContainer(
    SourceContainerId SERIAL PRIMARY KEY,
    SourceId INT NOT NULL,
    ContainerId INT NOT NULL,

    CONSTRAINT SourceContainer UNIQUE(
        ContainerId,
        SourceId
    ),

    FOREIGN KEY(ContainerId) REFERENCES bpContainer(ContainerId),
    FOREIGN KEY(SourceId) REFERENCES bpSource(SourceId)
);

-- creating user can use source in specific container
CREATE TABLE bpUserSourceContainer(
    UserContainerId INT NOT NULL,
    SourceContainerId INT NOT NULL,

    CONSTRAINT UserSourceContainer UNIQUE(
        UserContainerId,
        SourceContainerId
    ),

    FOREIGN KEY(UserContainerId) REFERENCES bpUserContainer(UserContainerId),
    FOREIGN KEY(SourceContainerId) REFERENCES bpSourceContainer(SourceContainerId)
);

-- create category table
CREATE TABLE bpCategory(
    CategoryId SERIAL PRIMARY KEY,
    CategoryName VARCHAR (255) NOT NULL,
    CategoryEstimation INT,

    ContainerId INT NOT NULL,

    FOREIGN KEY(ContainerId) REFERENCES bpContainer(ContainerId)
);

-- creating container has category
-- CREATE TABLE bpContainerCategory(
--     ContainerId SERIAL NOT NULL,
--     CategoryId SERIAL NOT NULL,
--     CategoryEstimation INT,

--     CONSTRAINT ContainerCategory PRIMARY KEY(
--         ContainerId,
--         CategoryId
--     ),

--     FOREIGN KEY(ContainerId) REFERENCES bpContainer(ContainerId),
--     FOREIGN KEY(CategoryId) REFERENCES bpCategory(CategoryId)
-- );

-- creating transaction table
-- transaction is made with source
-- user has made a transaction
CREATE TABLE bpTransaction(
    TransactionId SERIAL PRIMARY KEY,
    TransactionName VARCHAR (255) NOT NULL,
    TransactionDate DATE,
    TransactionAmount MONEY,--data type for money
    TransactionIsExpense BOOLEAN NOT NULL,
    TransactionNote VARCHAR (255),

    UserId INT NOT NULL,
    SourceId INT NOT NULL,

    FOREIGN KEY(UserId) REFERENCES bpUser(UserId),
    FOREIGN KEY(SourceId) REFERENCES bpSource(SourceId)
);

-- creating transaction is visible in container table
CREATE TABLE bpContainerTransaction(
    ContainerId INT NOT NULL,
    TransactionId INT NOT NULL,
    CategoryId INT,

    CONSTRAINT ContainerTransaction PRIMARY KEY(
        ContainerId,
        TransactionId
    ),

    FOREIGN KEY(ContainerId) REFERENCES bpContainer(ContainerId),
    FOREIGN KEY(TransactionId) REFERENCES bpTransaction(TransactionId),
    FOREIGN KEY(CategoryId) REFERENCES bpCategory(CategoryId)
);

-- creating notification table
CREATE TABLE bpNotification(
    NotificationId SERIAL PRIMARY KEY,

    UserId INT NOT NULL,
    TransactionId INT NOT NULL,

    FOREIGN KEY(UserId) REFERENCES bpUser(UserId),
    FOREIGN KEY(TransactionId) REFERENCES bpTransaction(TransactionId)
);

--create goal table
--container has a goal
CREATE TABLE bpGoal(
    GoalId SERIAL PRIMARY KEY,
    GoalName VARCHAR (255) NOT NULL,
    GoalAmount MONEY, 
    GoalDeadline DATE,

    ContainerId INT,

    FOREIGN KEY(ContainerId) REFERENCES bpContainer(ContainerId)
);

-- ********* INSERTING TEST DATA *********

--bpCurrency
INSERT INTO bpCurrency (CurrencyCode, CurrencyName, CurrencySymbol)
VALUES
/* 1 */    ('EUR', 'Euro', N'€'),
/* 2 */    ('BGN', 'Bulgarian lev', N'лв'),
/* 3 */    ('HRK', 'Croatian kuna', N'kn'),
/* 4 */    ('CZK', 'Czech koruna', N'Kč'),
/* 5 */    ('DKK', 'Danish krone', N'kr'),
/* 6 */    ('GBP', 'British pound', N'£'),
/* 7 */    ('HUF', 'Hungarian forint', N'Ft'),
/* 8 */    ('ISK', 'Icelandic króna', N'kr'),
/* 9 */    ('CHF', 'Swiss franc', N'Fr'),
/* 10 */    ('NOK', 'Norwegian krone', N'kr'),
/* 11 */    ('PLN', 'Polish złoty', N'zł'),
/* 12 */    ('RON', 'Romanian leu', N'lei'),
/* 13 */    ('RUB', 'Russian ruble', N'₽'),
/* 14 */    ('SEK', 'Swedish krona', N'kr'),
/* 15 */    ('CAD', 'Canadian dollar', N'$'),
/* 16 */    ('MXN', 'Mexican peso', N'$'),
/* 17 */    ('USD', 'United States dollar', N'$');

--bpUser
INSERT INTO bpUser (UserFirstName, UserLastName, UserIsDisabled, CurrencyId)
VALUES  
/* 1 */    ('Liam', 'Miller', false, 5),
/* 2 */    ('Ava', 'Miller', false, 10),
/* 3 */    ('Fiona', 'Watson', false, 3),
/* 4 */    ('Mike', 'Bailey', false, 7);

--bpLogin
INSERT INTO bpLogin (LoginUsername, LoginPassword, UserId)
VALUES
/* 1 */    ('Liam1', '$2a$10$R6VWA3Wfv0GqYf4NERMrIOjvtreWbhedKzNFVHQpihWt0RIBTz.A6', 1),    -- password: Liam1
/* 2 */    ('Ava2', '$2a$10$jklL5Skjf3/VpWAD99pak.aEHbU9Yq7PGkdrM8rH1tXkbD89aKw9e', 2),     -- password: Ava2
/* 3 */    ('Fiona3', '$2a$10$UlQODp7/URyBLejwxG8v2.UsSceKR7.53C5eX5zJYPjXjGTU8wXxq', 3),   -- password: Fiona3
/* 4 */    ('Mike4', '$2a$10$r4DNo/0nza.mRzjxSekGleg6uGiL.xUpiluE3lsieg4/ruhVC9zlW', 4);     -- password: Mike4

--bpSource
INSERT INTO bpSource (SourceName, SourceDescription, SourceAmount, UserId, CurrencyId)
VALUES
/* 1 */    ('Cash', 'Personal', 100000.4289, 1, 1),
/* 2 */    ('Sparnord', 'Shared', 68000.3568, 1, 17),
/* 3 */    ('Jyske', 'Shared', 45639.1325, 2, 1),
/* 4 */    ('Savings', 'Personal', 126543.4568, 2, 1),
/* 5 */    ('Nordea', 'Shared', 23569.7624, 3, 1),
/* 6 */    ('Vacation', 'Personal', 205689.4567, 3, 1),
/* 7 */    ('Sparnord', 'Personal', 6589314.5686, 4, 1);

--bpContainer
INSERT INTO bpContainer (ContainerName, UserId)
VALUES
/* 1 */    ('Private budget', 1),
/* 2 */    ('Shared budget', 1),
/* 3 */    ('Private budget', 2),
/* 4 */    ('Shared budget', 3),
/* 5 */    ('Private budget', 3),
/* 6 */    ('Private budget', 4);

--bpUserContainer
INSERT INTO bpUserContainer (UserId, ContainerId)
VALUES
/* 1 */    (1, 1),
/* 2 */    (1, 2),
/* 3 */    (2, 2),
/* 4 */    (2 ,3),
/* 5 */    (2, 4),
/* 6 */    (3, 4),
/* 7 */    (3, 5),
/* 8 */    (4, 6);

--bpSourceContainer
INSERT INTO bpSourceContainer (SourceId, ContainerId)
VALUES
/* 1 */    (1, 1),
/* 2 */    (2, 2),
/* 3 */    (3, 2),
/* 4 */    (4 ,3),
/* 5 */    (5, 4),
/* 6 */    (6, 5),
/* 7 */    (7, 6);

--bpUserSourceContainer
INSERT INTO bpUserSourceContainer (UserContainerId, SourceContainerId)
VALUES
/* 1 */    (1, 1),
/* 2 */    (2, 2),
/* 3 */    (2, 3),
/* 4 */    (3 ,2),
/* 5 */    (3, 3),
/* 6 */    (4, 4),
/* 7 */    (5, 5),
/* 8 */    (6, 5),
/* 9 */    (7, 6),
/* 10 */    (8, 7);

--bpCategory
INSERT INTO bpCategory (CategoryName, ContainerId, CategoryEstimation)
VALUES
/* 1 */    ('Clothes', 1, 1040),
/* 2 */    ('Footwear', 1, 850),
/* 3 */    ('Car', 1, 5500),
/* 4 */    ('Maintanance', 1, 1250),
/* 5 */    ('Savings', 1, 1205),
/* 6 */    ('Subscriptions', 1, 900),

/* 7 */    ('Groceries', 2, 1250),
/* 8 */    ('Transport', 2, 10000),
/* 9 */    ('Entertainment', 2, 950),
/* 10 */    ('Restaurants', 2, 2550),
/* 11 */    ('Bills', 2, 12000),
/* 12 */    ('Maintanance', 2, 1250),
/* 13 */    ('Trips', 2, 965),
/* 14 */    ('Savings', 2, 1205),

/* 15 */    ('Clothes', 1, 1040),
/* 16 */    ('Transport', 3, 10000),
/* 17 */    ('Entertainment', 3, 950),
/* 18 */    ('Footwear', 3, 850),
/* 19 */    ('Car', 3, 5500),
/* 20 */    ('Sport', 3, 2550),

/* 21 */    ('Entertainment', 4, 950),
/* 22 */    ('Restaurants', 4, 2550),
/* 23 */    ('Trips', 4, 965),

/* 24 */    ('Groceries', 5, 1250),
/* 25 */    ('Clothes', 5, 1040),
/* 26 */    ('Transport', 5, 10000),
/* 27 */    ('Bills', 5, 12000),
/* 28 */    ('Footwear', 5, 850),
/* 29 */    ('Car', 5, 5500),
/* 30 */    ('Trips', 5, 965),
/* 31 */    ('Savings', 5, 1205),

/* 32 */    ('Groceries', 6, 1250),
/* 33 */    ('Clothes', 6, 1040),
/* 34 */    ('Transport', 6, 10000),
/* 35 */    ('Entertainment', 6, 950),
/* 36 */    ('Restaurants', 6, 2550),
/* 37 */    ('Bills', 6, 12000),
/* 38 */    ('Footwear', 6, 850),
/* 39 */    ('Car', 6, 5500),
/* 40 */    ('Maintanance', 6, 1250),
/* 41 */    ('Sport', 6, 2550),
/* 42 */    ('Trips', 6, 965),
/* 43 */    ('Savings', 6, 1205),
/* 45 */    ('Subscriptions', 6, 900);

--bpContainerCategory
-- INSERT INTO bpContainerCategory (ContainerId, CategoryId, CategoryEstimation)
-- VALUES
-- /* 1 */    (1, 2, 1250),
-- /* 2 */    (1, 7, 1040),
-- /* 3 */    (1, 8, 10000),
-- /* 4 */    (1, 9, 20000),
-- /* 5 */    (1, 12, 30000),
-- /* 6 */    (1, 13, 500),

-- /* 7 */    (2, 1, 850),
-- /* 8 */    (2, 3, 950),
-- /* 9 */    (2, 4, 1250),
-- /* 10 */    (2, 5, 2550),
-- /* 11 */    (2, 6, 7500),
-- /* 12 */    (2, 9, 12000),
-- /* 13 */    (2, 11, 10000),
-- /* 14 */    (2, 12, 30000),

-- /* 15 */    (3, 2, 1000),
-- /* 16 */    (3, 3, 650),
-- /* 17 */    (3, 4, 750),
-- /* 18 */    (3, 7, 950),
-- /* 19 */    (3, 8, 25000),
-- /* 20 */    (3, 10, 6500),

-- /* 21 */    (4, 4, 5500),
-- /* 22 */    (4, 5, 6000),
-- /* 23 */    (4, 11, 11000),

-- /* 24 */    (5, 1, 900),
-- /* 25 */    (5, 2, 1200),
-- /* 26 */    (5, 3, 950),
-- /* 27 */    (5, 6, 5500),
-- /* 28 */    (5, 7, 2500),
-- /* 29 */    (5, 8, 25000),
-- /* 30 */    (5, 11, 15000),
-- /* 31 */    (5, 12, 10000),

-- /* 32 */    (6, 1, 850),
-- /* 33 */    (6, 2, 2500),
-- /* 34 */    (6, 3, 650),
-- /* 35 */    (6, 4, 750),
-- /* 36 */    (6, 5, 2250),
-- /* 37 */    (6, 6, 6550),
-- /* 38 */    (6, 7, 1205),
-- /* 39 */    (6, 8, 15000),
-- /* 40 */    (6, 9, 12000),
-- /* 41 */    (6, 10, 5000),
-- /* 42 */    (6, 11, 12000),
-- /* 43 */    (6, 12, 16505),
-- /* 44 */    (6, 13, 965);

--bpTransaction
INSERT INTO bpTransaction (TransactionName, TransactionDate, TransactionAmount, TransactionIsExpense, UserId, SourceId)
VALUES 
/* 1 */    ('Hoodie', '2020-09-07', 120.95, true, 1, 1),
/* 2 */    ('Sneakers', '2020-09-07', 1200.25, true, 1, 1),
/* 3 */    ('Blinkers', '2020-09-12', 650.75, true, 1, 1),
/* 4 */    ('Break fluid', '2020-09-12', 200.50, true, 1, 1),
/* 5 */    ('Salary', '2020-09-18', 65000, false, 1, 1),
/* 6 */    ('DR', '2020-09-18', 675.75, true, 1, 1),

/* 7 */    ('Veggies', '2020-09-11', 100.25, true, 1, 2),
/* 8 */    ('Rejsekort', '2020-09-12', 320, true, 2, 2),
/* 9 */    ('Fuel', '2020-09-12', 500.75, true, 1, 2),
/* 10 */    ('Happy', '2020-09-18', 420.50, true, 2, 2),
/* 11 */    ('Rent', '2020-09-18', 5000.95, true, 1, 2),
/* 12 */    ('Savings', '2020-09-24', 3575.25, false, 2, 2),

/* 13 */    ('Fruits', '2020-09-11', 100.25, true, 2, 3),
/* 14 */    ('Happy', '2020-09-18', 765.35, true, 1, 3),
/* 15 */    ('Phones', '2020-09-18', 420.25, true, 2, 3),
/* 16 */    ('Car check-up', '2020-09-12', 750.65, true, 1, 3),
/* 17 */    ('Savings', '2020-09-24', 4565.25, false, 1, 3),
/* 18 */    ('Aarhus', '2020-09-26', 420.65, true, 2, 3),

/* 19 */    ('Dress', '2020-09-07', 250.25, true, 2, 4),
/* 20 */    ('Heels', '2020-09-07', 550.45, true, 2, 4),
/* 21 */    ('Cinema', '2020-09-07', 210.25, true, 2, 4),
/* 22 */    ('Tires', '2020-09-12', 2045.35, true, 2, 4),
/* 23 */    ('Brakes', '2020-09-12', 3075.25, true, 2, 4),
/* 24 */    ('Salary', '2020-09-18', 70000, false, 2, 4),

/* 25 */    ('Cinema', '2020-09-08', 280.25, true, 2, 5),
/* 26 */    ('Aquapark', '2020-09-28', 600.45, true, 3, 5),
/* 27 */    ('Karting', '2020-09-28', 375.25, true, 2, 5),
/* 28 */    ('Bar', '2020-09-29', 1655.45, true, 3, 5),
/* 29 */    ('Happy', '2020-09-29', 465.25, true, 2, 5),
/* 30 */    ('Italy', '2020-09-1', 12650.25, true, 3, 5),

/* 31 */    ('Weekly groceries','2020-09-07', 325.25, true, 3, 6),
/* 32 */    ('Dress','2020-09-08', 550.35, true, 3, 6),
/* 33 */    ('Jeans','2020-09-08', 450.25, true, 3, 6),
/* 34 */    ('Rejsekort','2020-09-12', 355.95, true, 3, 6),
/* 35 */    ('Heels','2020-09-08', 1500.25, true, 3, 6),
/* 36 */    ('Salary','2020-09-18', 55250, false, 3, 6),

/* 37 */    ('Weekly groceries', '2020-09-06', 475.25, true, 4, 7),
/* 38 */    ('Rear lights', '2020-09-08', 685.65, true, 4, 7),
/* 39 */    ('Climbing gear', '2020-09-09', 1265.45, true, 4, 7),
/* 40 */    ('Youtube', '2020-09-12', 120.25, true, 4, 7),
/* 41 */    ('Netflix', '2020-09-12', 240.65, true, 4, 7),
/* 42 */    ('Salary', '2020-09-16', 60525, false, 4, 7);

--bpContainerTransaction
INSERT INTO bpContainerTransaction (ContainerId, TransactionId, CategoryId)
VALUES
/* 1 */    (1, 1, 1),
/* 2 */    (1, 2, 2),
/* 3 */    (1, 3, 3),
/* 4 */    (1, 4, 4),
/* 5 */    (1, 5, 5),
/* 6 */    (1, 6, 6),

/* 7 */    (2, 7, 7),
/* 8 */    (2, 8, 8),
/* 9 */    (2, 9, 12),
/* 10 */    (2, 10, 13),
/* 11 */    (2, 11, 11),
/* 12 */    (2, 12, 12),
/* 13 */    (2, 13, 13),
/* 14 */    (2, 14, 12),
/* 15 */    (2, 15, 8),
/* 16 */    (2, 16, 14),
/* 17 */    (2, 17, 9),
/* 18 */    (2, 18, 7),

/* 19 */    (3, 19, 15),
/* 20 */    (3, 20, 15),
/* 21 */    (3, 21, 16),
/* 22 */    (3, 22, 18),
/* 23 */    (3, 23, 19),
/* 24 */    (3, 24, 20),

/* 25 */    (4, 25, 21),
/* 26 */    (4, 26, 22),
/* 27 */    (4, 27, 22),
/* 28 */    (4, 28, 23),
/* 29 */    (4, 29, 21),
/* 30 */    (4, 30, 22),

/* 31 */    (5, 31, 25),
/* 32 */    (5, 32, 26),
/* 33 */    (5, 33, 28),
/* 34 */    (5, 34, 29),
/* 35 */    (5, 35, 30),
/* 36 */    (5, 36, 31),

/* 37 */    (6, 37, 40),
/* 38 */    (6, 38, 41),
/* 39 */    (6, 39, 42),
/* 40 */    (6, 40, 43),
/* 41 */    (6, 41, 44),
/* 42 */    (6, 42, 42);



-- ********* OPTIONAL *********
--bpNotification
INSERT INTO bpNotification (UserId, TransactionId)
VALUES
/* 1 */    (2, 8),
/* 2 */    (2, 10),
/* 3 */    (2, 12),

/* 4 */    (1, 14),
/* 5 */    (1, 16),
/* 6 */    (1, 17),

/* 7 */    (2, 25),
/* 8 */    (2, 27),
/* 9 */    (2, 29);

--bpGoal
INSERT INTO bpGoal (GoalName, GoalAmount, GoalDeadline, ContainerId)
VALUES
/* 1 */    ('Wedding ring', 105000, '2020-10-01', 1),
/* 2 */    ('New car', 65000, '2020-10-06', 2),
/* 3 */    ('New console', 8000, '2020-10-08', 3),
/* 4 */    ('Spend less on drinking', 50000, '2020-10-20', 4),
/* 5 */    ('New ring', 100000, '2020-10-30', 5),
/* 6 */    ('Trip to America', 2000000, '2020-10-30', 6);

SELECT * FROM bpCurrency;
SELECT * FROM bpUser;
SELECT * FROM bpLogin;
SELECT * FROM bpSource;
SELECT * FROM bpContainer;
SELECT * FROM bpUserContainer;
SELECT * FROM bpSourceContainer;
SELECT * FROM bpUserSourceContainer;
SELECT * FROM bpCategory;
-- SELECT * FROM bpContainerCategory;
SELECT * FROM bpTransaction;
SELECT * FROM bpContainerTransaction;
SELECT * FROM bpNotification;
SELECT * FROM bpGoal;
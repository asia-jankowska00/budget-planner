USE "1081601";
-- TABLE CREATION
--prefCurrency foreign key = jt_user_currency


-- creating user table
CREATE TABLE appUser(
    userID INT IDENTITY PRIMARY KEY,
    userFirstName NVARCHAR (255) NOT NULL,
    userLastName NVARCHAR (255) NOT NULL,
    userName NVARCHAR (255) NOT NULL,
    userEmail NVARCHAR (255) NOT NULL,
    userPassword NVARCHAR (255) NOT NULL,
    userIsDisabled BIT,
);

-- createing currency table
CREATE TABLE currency(
    currencyID INT IDENTITY PRIMARY KEY,
    currencyName NVARCHAR (255),
    currencyCode NVARCHAR (50)
);

-- creating user preffered currency table
CREATE TABLE jt_appUser_currency(
    FK_appUserID INT,
    FK_currencyID INT,

    CONSTRAINT PK_user_currency PRIMARY KEY(
        FK_appUserID,
        FK_currencyID
    ),

    FOREIGN KEY(FK_appUserID) REFERENCES appUser(userID),
    FOREIGN KEY(FK_currencyID) REFERENCES currency(currencyID)
);

-- creating source table
-- user owns source
-- currency can be used in source
CREATE TABLE source(
    sourceID INT IDENTITY PRIMARY KEY,
    sourceName NVARCHAR (255) NOT NULL,
    sourceAccountDescription NVARCHAR(255),
    sourceAmount MONEY NOT NULL, --come back, money format
    sourceCurrency NVARCHAR (50) NOT NULL,

    FK_appUserID INT,
    FK_currencyID INT

    FOREIGN KEY(FK_appUserID) REFERENCES appUser(userID),
    FOREIGN KEY(FK_currencyID) REFERENCES currency(currencyID)
);

-- creating user can use source table
CREATE TABLE jt_appUser_source(
    FK_appUserID INT,
    FK_sourceID INT,

    CONSTRAINT PK_appUser_source PRIMARY KEY(
        FK_appUserID,
        FK_sourceID
    ),

    FOREIGN KEY(FK_appUserID) REFERENCES appUser(userID),
    FOREIGN KEY(FK_sourceID) REFERENCES source(sourceID)
);

-- creating source will have currency table
CREATE TABLE jt_currency_source(
    FK_currencyID INT,
    FK_sourceID INT,

    CONSTRAINT PK_currency_source PRIMARY KEY(
        FK_currencyID,
        FK_sourceID
    ),

    FOREIGN KEY(FK_currencyID) REFERENCES currency(currencyID),
    FOREIGN KEY(FK_sourceID) REFERENCES source(sourceID)
);

--creating container table
-- user owns container
CREATE TABLE container(
    containerID INT IDENTITY PRIMARY KEY,
    containerName NVARCHAR (255) NOT NULL,

    FK_appUserID INT,

    FOREIGN KEY(FK_appUserID) REFERENCES appUser(userID)
);

-- creating user has access to container
CREATE TABLE jt_user_container(
    FK_appUserID INT,
    FK_containerID INT,

    CONSTRAINT PK_user_container PRIMARY KEY(
        FK_appUserID,
        FK_containerID
    ),

    FOREIGN KEY(FK_appUserID) REFERENCES appUser(userID),
    FOREIGN KEY(FK_containerID) REFERENCES container(containerID)
);

-- creating container includes source table
CREATE TABLE jt_container_source(
    FK_containerID INT,
    FK_sourceID INT,

    CONSTRAINT PK_container_source PRIMARY KEY(
        FK_containerID,
        FK_sourceID
    ),

    FOREIGN KEY(FK_containerID) REFERENCES container(containerID),
    FOREIGN KEY(FK_sourceID) REFERENCES source(sourceID)
);

-- create category table
-- can be found in
CREATE TABLE category(
    categoryID INT IDENTITY PRIMARY KEY,
    categoryName NVARCHAR (255) NOT NULL
);

-- creating container has category
CREATE TABLE jt_container_category(
    FK_containerID INT,
    FK_categoryID INT

    CONSTRAINT PK_container_category PRIMARY KEY(
        FK_containerID,
        FK_categoryID
    ),

    FOREIGN KEY(FK_containerID) REFERENCES container(containerID),
    FOREIGN KEY(FK_categoryID) REFERENCES category(categoryID)
);

-- creating transaction table
-- transaction is made with source
-- user has made a transaction
CREATE TABLE appTransaction(
    appTransactionID INT IDENTITY PRIMARY KEY,
    appTransactionName NVARCHAR (255) NOT NULL,
    appTransactionDate DATETIME,
    appTransactionAmount MONEY,--data type for money
    appTransactionIsExpense BIT NOT NULL,
    appTransactionNote NVARCHAR (255),

    FK_appUserID INT,
    FK_sourceID INT,
    FK_categoryID INT

    FOREIGN KEY(FK_appUserID) REFERENCES appUser(userID),
    FOREIGN KEY(FK_sourceID) REFERENCES source(sourceID),
    FOREIGN KEY(FK_categoryID) REFERENCES category(categoryID)
);

-- creating transaction is visible in container table
CREATE TABLE jt_container_appTransaction(
    FK_containerID INT,
    FK_appTransactionID INT,

    CONSTRAINT PK_container_appTransaction PRIMARY KEY(
        FK_containerID,
        FK_appTransactionID
    ),

    FOREIGN KEY(FK_containerID) REFERENCES container(containerID),
    FOREIGN KEY(FK_appTransactionID) REFERENCES appTransaction(appTransactionID)
);

-- creating transaction will have category
CREATE TABLE jt_appTransaction_category(
    FK_appTransactionID INT,
    FK_categoryID INT,

    CONSTRAINT PK_appTransaction_category PRIMARY KEY(
        FK_appTransactionID,
        FK_categoryID
    ),

    FOREIGN KEY(FK_appTransactionID) REFERENCES appTransaction(appTransactionID),
    FOREIGN KEY(FK_categoryID) REFERENCES category(categoryID)
);

-- creating notification table
CREATE TABLE appNotification(
    appNotificationID INT IDENTITY PRIMARY KEY,

    FK_appUserID INT,

    FOREIGN KEY(FK_appUserID) REFERENCES appUser(userID)
);

--creating notification is about transaction
CREATE TABLE jt_appTransaction_notification(
    FK_appTransactionID INT,
    FK_appNotificationID INT,

    CONSTRAINT PK_appTransaction_notification PRIMARY KEY(
        FK_appTransactionID,
        FK_appNotificationID
    ),

    FOREIGN KEY(FK_appTransactionID) REFERENCES appTransaction(appTransactionID),
    FOREIGN KEY(FK_appNotificationID) REFERENCES appNotification(appNotificationID)
);

--create goal table
--container has a goal
CREATE TABLE goal(
    goalID INT IDENTITY PRIMARY KEY,
    goalName NVARCHAR (255) NOT NULL,
    goalAmount MONEY, --come back for format for money
    goalDeadline DATE,

    FK_containerID INT,

    FOREIGN KEY(FK_containerID) REFERENCES container(containerID),
);

-- creating goal belongs to container
CREATE TABLE jt_container_goal(
    FK_containerID INT,
    FK_goalID INT,

    CONSTRAINT PK_container_goal PRIMARY KEY(
        FK_containerID,
        FK_goalID
    ),

    FOREIGN KEY(FK_containerID) REFERENCES container(containerID),
    FOREIGN KEY(FK_goalID) REFERENCES goal(goalID)
);
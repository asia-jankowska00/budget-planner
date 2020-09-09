USE "1081601";

-- createing currency table
CREATE TABLE bpCurrency( 
    ID INT IDENTITY PRIMARY KEY,
    currencyName NVARCHAR (255),
    currencyCode NVARCHAR (50)
);

-- creating user table
CREATE TABLE bpUser( 
    ID INT IDENTITY PRIMARY KEY,
    firstName NVARCHAR (255) NOT NULL,
    lastName NVARCHAR (255) NOT NULL,
    IsDisabled BIT,

    FK_bpCurrency INT,

    FOREIGN KEY (FK_bpCurrency) REFERENCES bpCurrency(ID)
);

CREATE TABLE bpLogin(
    ID INT IDENTITY PRIMARY KEY,
    userUsername NVARCHAR (255) NOT NULL,
    userPassword NVARCHAR (255) NOT NULL,

    FK_User INT,

    CONSTRAINT FK_Login_User FOREIGN KEY(FK_User) REFERENCES bpUser(ID)
);

-- creating source table
-- user owns source
-- currency can be used in source
CREATE TABLE bpSource(
    ID INT IDENTITY PRIMARY KEY,
    sourceName NVARCHAR (255) NOT NULL,
    sourceDescription NVARCHAR(255),
    amount MONEY NOT NULL, --come back, money format
     -- currency NVARCHAR (50) NOT NULL,

    FK_bpUser INT,
    FK_bpCurrency INT

    FOREIGN KEY(FK_bpUser) REFERENCES bpUser(ID),
    FOREIGN KEY(FK_bpCurrency) REFERENCES bpCurrency(ID)
);

-- creating user can use source table
CREATE TABLE bpUserSource(
    FK_bpUser INT,
    FK_bpSource INT,

    CONSTRAINT PK_bpUserSource PRIMARY KEY(
        FK_bpUser,
        FK_bpSource
    ),

    FOREIGN KEY(FK_bpUser) REFERENCES bpUser(ID),
    FOREIGN KEY(FK_bpSource) REFERENCES bpSource(ID)
);

--creating container table
-- user owns container
CREATE TABLE bpContainer(
    ID INT IDENTITY PRIMARY KEY,
    containerName NVARCHAR (255) NOT NULL,

    FK_bpUser INT,

    FOREIGN KEY(FK_bpUser) REFERENCES bpUser(ID)
);

-- creating user has access to container
CREATE TABLE bpUserContainer(
    FK_bpUser INT,
    FK_bpContainer INT,

    CONSTRAINT PK_bpUserContainer PRIMARY KEY(
        FK_bpUser,
        FK_bpContainer
    ),

    FOREIGN KEY(FK_bpUser) REFERENCES bpUser(ID),
    FOREIGN KEY(FK_bpContainer) REFERENCES bpContainer(ID)
);

-- creating container includes source table
CREATE TABLE bpContainerSource(
    FK_bpContainer INT,
    FK_bpSource INT,

    CONSTRAINT PK_bpContainerSource PRIMARY KEY(
        FK_bpContainer,
        FK_bpSource
    ),

    FOREIGN KEY(FK_bpContainer) REFERENCES bpContainer(ID),
    FOREIGN KEY(FK_bpSource) REFERENCES bpSource(ID)
);

-- create category table
-- can be found in
CREATE TABLE bpCategory(
    ID INT IDENTITY PRIMARY KEY,
    categoryName NVARCHAR (255) NOT NULL
);

-- creating container has category
CREATE TABLE bpContainerCategory(
    FK_bpContainer INT,
    FK_bpCategory INT

    CONSTRAINT PK_bpContainerCategory PRIMARY KEY(
        FK_bpContainer,
        FK_bpCategory
    ),

    FOREIGN KEY(FK_bpContainer) REFERENCES bpContainer(ID),
    FOREIGN KEY(FK_bpCategory) REFERENCES bpCategory(ID)
);

-- creating transaction table
-- transaction is made with source
-- user has made a transaction
CREATE TABLE bpTransaction(
    ID INT IDENTITY PRIMARY KEY,
    transactionName NVARCHAR (255) NOT NULL,
    transactionDate DATETIME,
    amount MONEY,--data type for money
    isExpense BIT NOT NULL,
    note NVARCHAR (255),

    FK_bpUser INT,
    FK_bpSource INT,
    FK_bpCategory INT,

    FOREIGN KEY(FK_bpUser) REFERENCES bpUser(ID),
    FOREIGN KEY(FK_bpSource) REFERENCES bpSource(ID),
    FOREIGN KEY(FK_bpCategory) REFERENCES bpCategory(ID)
);

-- creating transaction is visible in container table
CREATE TABLE bpContainerTransaction(
    FK_bpContainer INT,
    FK_bpTransaction INT,

    CONSTRAINT PK_container_appTransaction PRIMARY KEY(
        FK_bpContainer,
        FK_bpTransaction
    ),

    FOREIGN KEY(FK_bpContainer) REFERENCES bpContainer(ID),
    FOREIGN KEY(FK_bpTransaction) REFERENCES bpTransaction(ID)
);

-- creating notification table
CREATE TABLE bpNotification(
    ID INT IDENTITY PRIMARY KEY,

    FK_bpUser INT,

    FOREIGN KEY(FK_bpUser) REFERENCES bpUser(ID)
);

--create goal table
--container has a goal
CREATE TABLE bpGoal(
    ID INT IDENTITY PRIMARY KEY,
    goalName NVARCHAR (255) NOT NULL,
    amount MONEY, 
    deadline DATE,

    FK_bpContainer INT,

    FOREIGN KEY(FK_bpContainer) REFERENCES bpContainer(ID)
);
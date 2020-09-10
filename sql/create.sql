USE "1081601";

-- createing currency table
CREATE TABLE bpCurrency( 
    CurrencyId INT IDENTITY PRIMARY KEY,
    CurrencyName NVARCHAR (255),
    CurrencyCode NVARCHAR (50)
);

-- creating user table
CREATE TABLE bpUser( 
    UserId INT IDENTITY PRIMARY KEY,
    UserFirstName NVARCHAR (255) NOT NULL,
    UserLastName NVARCHAR (255) NOT NULL,
    UserIsDisabled BIT,

    CurrencyId INT,

    FOREIGN KEY (CurrencyId) REFERENCES bpCurrency(CurrencyId)
);

CREATE TABLE bpLogin(
    LoginId INT IDENTITY PRIMARY KEY,
    LoginUsername NVARCHAR (255) NOT NULL,
    LoginPassword NVARCHAR (255) NOT NULL,

    UserId INT,

    CONSTRAINT LoginUser FOREIGN KEY(UserId) REFERENCES bpUser(UserId)
);

-- creating source table
-- user owns source
-- currency can be used in source
CREATE TABLE bpSource(
    SourceId INT IDENTITY PRIMARY KEY,
    SourceName NVARCHAR (255) NOT NULL,
    SourceDescription NVARCHAR(255),
    SourceAmount MONEY NOT NULL, --come back, money format
     -- currency NVARCHAR (50) NOT NULL,

    UserId INT,
    CurrencyId INT

    FOREIGN KEY(UserId) REFERENCES bpUser(UserId),
    FOREIGN KEY(CurrencyId) REFERENCES bpCurrency(CurrencyId)
);

-- creating user can use source table
CREATE TABLE bpUserSource(
    UserId INT,
    SourceId INT,

    CONSTRAINT PK_bpUserSource PRIMARY KEY(
        UserId,
        SourceId
    ),

    FOREIGN KEY(UserId) REFERENCES bpUser(UserId),
    FOREIGN KEY(SourceId) REFERENCES bpSource(SourceId)
);

--creating container table
-- user owns container
CREATE TABLE bpContainer(
    ContainerId INT IDENTITY PRIMARY KEY,
    ContainerName NVARCHAR (255) NOT NULL,

    UserId INT,

    FOREIGN KEY(UserId) REFERENCES bpUser(UserId)
);

-- creating user has access to container
CREATE TABLE bpUserContainer(
    UserId INT,
    ContainerId INT,

    CONSTRAINT UserContainer PRIMARY KEY(
        UserId,
        ContainerId
    ),

    FOREIGN KEY(UserId) REFERENCES bpUser(ID),
    FOREIGN KEY(ContainerId) REFERENCES bpContainer(ID)
);

-- creating container includes source table
CREATE TABLE bpContainerSource(
    ContainerId INT,
    SourceId INT,

    CONSTRAINT ContainerSource PRIMARY KEY(
        ContainerId,
        SourceId
    ),

    FOREIGN KEY(ContainerId) REFERENCES bpContainer(ContainerId),
    FOREIGN KEY(SourceId) REFERENCES bpSource(SourceId)
);

-- create category table
-- can be found in
CREATE TABLE bpCategory(
    CategoryId INT IDENTITY PRIMARY KEY,
    CategoryName NVARCHAR (255) NOT NULL,
);

-- creating container has category
CREATE TABLE bpContainerCategory(
    ContainerId INT,
    CategoryId INT,
    CategoryEstimation INT,

    CONSTRAINT ContainerCategory PRIMARY KEY(
        ContainerId,
        CategoryId
    ),

    FOREIGN KEY(ContainerId) REFERENCES bpContainer(ContainerId),
    FOREIGN KEY(CategoryId) REFERENCES bpCategory(CategoryId)
);

-- creating transaction table
-- transaction is made with source
-- user has made a transaction
CREATE TABLE bpTransaction(
    TransactionId INT IDENTITY PRIMARY KEY,
    TransactionName NVARCHAR (255) NOT NULL,
    TransactionDate DATETIME,
    TransactionAmount MONEY,--data type for money
    TransactionIsExpense BIT NOT NULL,
    TransactionNote NVARCHAR (255),

    UserId INT,
    SourceId INT,
    CategoryId INT,

    FOREIGN KEY(UserId) REFERENCES bpUser(UserId),
    FOREIGN KEY(SourceId) REFERENCES bpSource(SourceId),
    FOREIGN KEY(CategoryId) REFERENCES bpCategory(CategoryId)
);

-- creating transaction is visible in container table
CREATE TABLE bpContainerTransaction(
    ContainerId INT,
    TransactionId INT,

    CONSTRAINT PK_container_appTransaction PRIMARY KEY(
        ContainerId,
        TransactionId
    ),

    FOREIGN KEY(ContainerId) REFERENCES bpContainer(ContainerId),
    FOREIGN KEY(TransactionId) REFERENCES bpTransaction(TransactionId)
);

-- creating notification table
CREATE TABLE bpNotification(
    NotificationId INT IDENTITY PRIMARY KEY,

    UserId INT,

    FOREIGN KEY(UserId) REFERENCES bpUser(UserId)
);

--create goal table
--container has a goal
CREATE TABLE bpGoal(
    GoalId INT IDENTITY PRIMARY KEY,
    GoalName NVARCHAR (255) NOT NULL,
    GoalAmount MONEY, 
    GoalDeadline DATE,

    ContainerId INT,

    FOREIGN KEY(ContainerId) REFERENCES bpContainer(ContainerId)
);
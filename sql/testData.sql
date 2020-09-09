-- ADD TEST DATA

USE "1081601";

-- INSERT INTO bpCurrency(currencyName,currencyCode)
-- VALUES  (@currencyName, @currencyCode);
-- ########
INSERT INTO bpCurrency(currencyName,currencyCode)
VALUES  ('Danish Krone', 'DKK'),
        ('Euro', 'EUR'),
        ('Bulgarian Lev', 'BGN'),
        ('Zloty', 'PLN'),
        ('Romanian Leu', 'RON');

-- INSERT INTO bpUser(firstName,lastName,IsDisabled)
-- VALUES  (@firstName, @lastName, 0);
--#########
INSERT INTO bpUser(firstName,lastName,IsDisabled, FK_bpCurrency)
VALUES  ('Alexandru', 'Bogdan', 0, 1),
        ('Joanna', 'Jankowska', 0, 4),
        ('Nikolay', 'Rusev', 0, 2);

-- INSERT INTO bpLogin(userUsername,userPassword)
-- VALUES  (@userUsername, @userPassword);
-- ########
INSERT INTO bpLogin(userUsername,userPassword, FK_User)
VALUES  ('afbogdan', 'Password123', 1),
        ('joanna-00', 'Password456', 2),
        ('nikolayr21', 'Password789', 3);

INSERT INTO bpSource(sourceName, sourceDescription, amount, FK_bpUser,FK_bpCurrency)
VALUES  ('Sparnord', 'Main bank account', 14000.35, 1, 1),
        ('Cash', 'Emergency on-hand money', 10000, 2, 4),
        ('Savings', 'For trips', 16000, 3, 2);

INSERT INTO bpContainer(containerName, FK_bpUser)
VALUES  ('Private budget', 1),
        ('Shared budget', 1),
        ('Private budget', 2),
        ('Shared budget', 2),
        ('Private budget', 3),
        ('Shared budget', 3);

INSERT INTO bpCategory(categoryName)
VALUES  ('Groceries'),
        ('Clothes'),
        ('Transport'),
        ('Entertainment'),
        ('Restaurants'),
        ('Footwear'),
        ('Bills');

INSERT INTO bpTransaction (transactionName, transactionDate, amount, isExpense, FK_bpUser, FK_bpSource, FK_bpCategory)
VALUES  ('Weekly groceries', 2020-09-25, 250, 1, 2, 2, 1),
        ('6 month DR subscription', 2020-06-01, 660, 1, 1, 1, 7),
        ('1 year Game card', 2019-11-20, 372, 1, 3, 3, 4),
        ('Adobe package', 2020-09-01, 168, 1, 2, 2, 4),
        ('Spotify subscription',2020-09-10, 40, 1,  3, 3, 4),
        ('Netflix subscription', 2020-08-28, 160, 1, 1, 1, 4);

INSERT INTO bpContainerSource(FK_bpContainer, FK_bpSource) VALUES  
        (1, 1),
        (2, 1),
        (3, 2),
        (4, 2),
        (5, 3),
        (6, 3);

-- >>>>>> bpUserSource --
-- >>>>>> bpUserContainer --
-- >>>>>> bpContainerSource --
-- >>>>>> bpContainerCategory --
-- >>>>>> bpContainerTransaction

SELECT * FROM bpUser;
SELECT * FROM bpLogin;
SELECT * FROM bpCurrency;
SELECT * FROM bpSource;
SELECT * FROM bpContainer;
SELECT * FROM bpCategory;
SELECT * FROM bpTransaction;
SELECT * FROM bpContainerSource;

SELECT firstName, lastName, FK_bpCurrency
FROM bpUser
INNER JOIN bpLogin
ON bpLogin.FK_User = bpUser.ID
WHERE bpLogin.userUsername = 'afbogdan' AND bpLogin.userPassword = 'Password123' AND bpUser.IsDisabled = 0;

SELECT bpUser.ID, bpUser.firstName, bpUser.lastName, bpCurrency.currencyName, bpCurrency.currencyCode
FROM bpUser
INNER JOIN bpLogin
ON bpLogin.FK_User = bpUser.ID
INNER JOIN bpCurrency
ON bpUser.FK_bpCurrency = bpCurrency.ID
WHERE bpLogin.userUsername = 'afbogdan'
AND bpLogin.userPassword = 'Password123'
AND bpUser.IsDisabled = 0
AND bpCurrency.ID = bpUser.FK_bpCurrency;

SELECT firstName, lastName, sourceName, amount
FROM bpUser
INNER JOIN bpSource
ON bpSource.FK_bpUser = bpUser.ID;

SELECT firstName, lastName, containerName, bpContainer.ID
FROM bpUser
INNER JOIN bpContainer
ON bpContainer.FK_bpUser = bpUser.ID;

SELECT bpContainer.containerName, bpContainer.FK_bpUser, bpContainerSource.FK_bpContainer, bpContainerSource.FK_bpSource
FROM bpContainer
INNER JOIN bpContainerSource
ON bpContainerSource.FK_bpContainer = bpContainer.ID;
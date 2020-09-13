-- ADD TEST DATA

USE "1081578";

-- INSERT INTO bpCurrency(currencyName,currencyCode)
-- VALUES  (@currencyName, @currencyCode);
-- ########
-- INSERT INTO bpCurrency(CurrencyName, CurrencyCode)
-- VALUES  ('Danish Krone', 'DKK'),
--         ('Euro', 'EUR'),
--         ('Bulgarian Lev', 'BGN'),
--         ('Zloty', 'PLN'),
--         ('Romanian Leu', 'RON');

-- INSERT INTO bpUser(firstName,lastName,IsDisabled)
-- VALUES  (@firstName, @lastName, 0);
--#########
-- INSERT INTO bpUser(UserFirstName, UserLastName, UserIsDisabled, CurrencyId)
-- VALUES  ('Alexandru', 'Bogdan', 0, 1),
--         ('Joanna', 'Jankowska', 0, 4),
--         ('Nikolay', 'Rusev', 0, 2);

-- INSERT INTO bpLogin(userUsername,userPassword)
-- VALUES  (@userUsername, @userPassword);
-- ########
-- INSERT INTO bpLogin(LoginUsername, LoginPassword, UserId)
-- VALUES  ('afbogdan', 'Password123', 1),
--         ('joanna-00', 'Password456', 2),
--         ('nikolayr21', 'Password789', 3);

INSERT INTO bpSource(SourceName, SourceDescription, SourceAmount, UserId, CurrencyId)
VALUES  ('Sparnord', 'Main bank account', 14000.35, 1, 1),
        ('Cash', 'Emergency on-hand money', 10000, 2, 4),
        ('Savings', 'For trips', 16000, 3, 2);

INSERT INTO bpContainer(ContainerName, UserId)
VALUES  ('Private budget', 1),
        ('Shared budget', 1),
        ('Private budget', 2),
        ('Shared budget', 2),
        ('Private budget', 3),
        ('Shared budget', 3);

INSERT INTO bpCategory(CategoryName)
VALUES  ('Groceries'),
        ('Clothes'),
        ('Transport'),
        ('Entertainment'),
        ('Restaurants'),
        ('Footwear'),
        ('Bills');

INSERT INTO bpTransaction (TransactionName, TransactionDate, TransactionAmount, TransactionIsExpense, UserId, SourceId, CategoryId)
VALUES  ('Weekly groceries', 2020-09-25, 250, 1, 2, 2, 1),
        ('6 month DR subscription', 2020-06-01, 660, 1, 1, 1, 7),
        ('1 year Game card', 2019-11-20, 372, 1, 3, 3, 4),
        ('Adobe package', 2020-09-01, 168, 1, 2, 2, 4),
        ('Spotify subscription',2020-09-10, 40, 1,  3, 3, 4),
        ('Netflix subscription', 2020-08-28, 160, 1, 1, 1, 4);

INSERT INTO bpContainerSource(ContainerId, SourceId) VALUES  
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

-- SELECT UserFirstName, UserLastName, CurrencyId
-- FROM bpUser
-- INNER JOIN bpLogin
-- ON bpLogin.UserId = bpUser.UserId
-- WHERE bpLogin.LoginUsername = 'afbogdan' 
-- AND bpLogin.LoginPassword = 'Password123' 
-- AND bpUser.UserIsDisabled = 0;

-- SELECT bpUser.UserId, bpUser.UserFirstName, bpUser.UserLastName, bpCurrency.CurrencyName, bpCurrency.CurrencyCode
-- FROM bpUser
-- INNER JOIN bpLogin
-- ON bpLogin.UserId = bpUser.UserId
-- INNER JOIN bpCurrency
-- ON bpUser.CurrencyId = bpCurrency.CurrencyId
-- WHERE bpLogin.LoginUsername = 'afbogdan'
-- AND bpLogin.LoginPassword = 'Password123'
-- AND bpUser.UserIsDisabled = 0
-- AND bpCurrency.CurrencyId = bpUser.CurrencyId;

SELECT UserFirstName, UserLastName, SourceName, SourceAmount
FROM bpUser
INNER JOIN bpSource
ON bpSource.UserId = bpUser.UserId;

SELECT UserFirstName, UserLastName, ContainerName, bpContainer.ContainerId
FROM bpUser
INNER JOIN bpContainer
ON bpContainer.UserId = bpUser.UserId;

SELECT bpContainer.ContainerName, bpContainer.UserId, bpContainerSource.ContainerId, bpContainerSource.SourceId
FROM bpContainer
INNER JOIN bpContainerSource
ON bpContainerSource.ContainerId = bpContainer.ContainerId;
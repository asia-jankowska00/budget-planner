-- ADD TEST DATA

-- INSERT INTO bpCurrency(currencyName,currencyCode)
-- VALUES  (@currencyCode, @currencyName, @currencySymbol);
-- ########
INSERT INTO bpCurrency (CurrencyCode, CurrencyName, CurrencySymbol)
  VALUES
  ('EUR', 'Euro', N'€'),
    ('ALL', 'Albanian lek', N'L'),
    ('BYN', 'New Belarusian ruble', N'Br'),
    ('BAM', 'Bosnia and Herzegovina convertible mark', N'null'),
    ('BGN', 'Bulgarian lev', N'лв'),
    ('HRK', 'Croatian kuna', N'kn'),
    ('CZK', 'Czech koruna', N'Kč'),
    ('DKK', 'Danish krone', N'kr'),
    ('GIP', 'Gibraltar pound', N'£'),
    ('GBP', 'British pound', N'£'),
    ('HUF', 'Hungarian forint', N'Ft'),
    ('ISK', 'Icelandic króna', N'kr'),
    ('CHF', 'Swiss franc', N'Fr'),
    ('MKD', 'Macedonian denar', N'ден'),
    ('MDL', 'Moldovan leu', N'L'),
    ('NOK', 'Norwegian krone', N'kr'),
    ('PLN', 'Polish złoty', N'zł'),
    ('RON', 'Romanian leu', N'lei'),
    ('RUB', 'Russian ruble', N'₽'),
    ('RSD', 'Serbian dinar', N'дин.'),
    ('SEK', 'Swedish krona', N'kr'),
    ('UAH', 'Ukrainian hryvnia', N'₴'),
    ('CAD', 'Canadian dollar', N'$'),
    ('MXN', 'Mexican peso', N'$'),
    ('USD', 'United States dollar', N'$')

-- INSERT INTO bpUser(firstName,lastName,IsDisabled)
-- VALUES  (@firstName, @lastName, 0);
--#########
INSERT INTO bpUser(UserFirstName, UserLastName, UserIsDisabled, CurrencyId)
VALUES  ('Alexandru', 'Bogdan', 0, 18),
        ('Joanna', 'Jankowska', 0, 17),
        ('Nikolay', 'Rusev', 0, 5),
        ('Test', 'User', 0, 10),
        ('User', 'Test', 0, 1);

-- INSERT INTO bpLogin(userUsername,userPassword)
-- VALUES  (@userUsername, @userPassword);
-- ########
INSERT INTO bpLogin(LoginUsername, LoginPassword, UserId)
VALUES  ('alex', '$2a$10$QtsXlM1igWbBpjBezZwM.OGpk6qeLcFd.vEqRCxz8JPGKwswSffLS', 1),
        ('asia', '$2a$10$liEg46hB2l8SRVlp8qCQ/eKwNr5sMJ9nhpehG/wokQtecFvNicj7W', 2),
        ('nick', '$2a$10$uIX7uKd8Ni.nUprBzaUMeeu/EvEVDXxqx/pQcnbma5NQF4AqqRKhC', 3),
        ('test', '$2a$10$iy5TWgwEx1TtZfegDABfqeUIY6i1nKeMkMuThio9HBZK9hXQu6JPe', 4),
        ('user', '$2a$10$cO/9M4qQD6dX41uwiGwd4udnbqqzfJpnPakVFVhTm47N4eDLd/VOG', 5);

INSERT INTO bpSource(SourceName, SourceDescription, SourceAmount, UserId, CurrencyId)
VALUES  ('Sparnord', 'Main bank account', 14000.35, 1, 18),
        ('Cash', 'Emergency on-hand money', 10000, 2, 17),
        ('Savings', 'For trips', 16000, 3, 5),
        ('Cash', 'Emergency on-hand money', 10000, 4, 10),
        ('Cash', 'Emergency on-hand money', 10000, 5, 1);

INSERT INTO bpContainer(ContainerName, UserId)
VALUES  ('Private budget', 1),
        ('Shared budget', 1),
        ('Private budget', 2),
        ('Shared budget', 2),
        ('Private budget', 3),
        ('Shared budget', 3),
        ('Private budget', 4),
        ('Shared budget', 4),
        ('Private budget', 5),
        ('Shared budget', 5);

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
SELECT * FROM bpTransaction;
SELECT * FROM bpCategory;

SELECT * FROM bpContainer;
SELECT * FROM bpContainerSource;
SELECT * FROM bpUserContainer;
SELECT * FROM bpContainerCategory;

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
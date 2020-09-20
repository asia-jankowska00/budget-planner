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
        ('Cash', 'Emergency on-hand money', 10000, 1, 17),
        ('Savings', 'For trips', 16000, 3, 5),
        ('Some account', 'Just money', 10000, 3, 10),
        ('Another account', 'Emergency on-hand money', 10000, 2, 1),
        ('Another another account', 'Emergency on-hand money', 10000, 4, 1),
        ('Vacation account', 'Just money', 10000, 2, 10);

INSERT INTO bpContainer(ContainerName, UserId)
  VALUES  ('Private budget', 1),
        ('Elegant budget', 2),
        ('Colorful budget', 1),
        ('Quirky budget', 2),
        ('Another budget', 3),
        ('Boring budget', 3)
        -- ('Interesting budget', 4),
        -- ('Flavorless budget', 4),
        -- ('Salty budget', 5),
        -- ('Cute budget', 5);

INSERT INTO bpCategory(CategoryName)
  VALUES  ('Groceries'),
        ('Clothes'),
        ('Transport'),
        ('Entertainment'),
        ('Restaurants'),
        ('Footwear'),
        ('Bills');

INSERT INTO bpTransaction (TransactionName, TransactionDate, TransactionAmount, TransactionIsExpense, UserId, SourceId)
  VALUES  ('Weekly groceries', 2020-09-25, 250, 1, 2, 2),
        ('6 month DR subscription', 2020-06-01, 660, 1, 1, 1),
        ('1 year Game card', 2019-11-20, 372, 1, 3, 3),
        ('Adobe package', 2020-09-01, 168, 1, 2, 2),
        ('Spotify subscription',2020-09-10, 40, 1,  3, 3),
        ('Netflix subscription', 2020-08-28, 160, 1, 1, 1);

INSERT INTO bpUserContainer(UserId, ContainerId) 
  VALUES  
  (1, 1),
  (2, 1),
  (3, 2),
  (1, 2),
  (2, 2),
  (3, 5),
  (3, 6);

INSERT INTO bpSourceContainer(SourceId, ContainerId) 
  VALUES  
  (1, 1),
  (2, 1),
  (3, 2),
  (4, 2),
  (5, 1),
  (1, 2);

INSERT INTO bpUserSourceContainer (UserContainerId, SourceContainerId)
  VALUES
  (1, 1),
  (1, 2),
  (2, 2),
  (3, 3),
  (3, 4),
  (4, 3),
  (5, 3),
  (4, 6);

INSERT INTO bpContainerCategory (ContainerId, CategoryId, CategoryEstimation)
VALUES 
(5, 3, 100),
(5, 6, 20),
(1, 5, 0),
(1, 4, NULL),
(2, 2, 213);

INSERT INTO bpContainerTransaction(ContainerId, TransactionId, CategoryId)
VALUES
(5, 3, 6),
(5, 5, 3);

SELECT * FROM bpContainerCategory;
SELECT * FROM bpContainerTransaction;
SELECT * FROM bpCategory;

SELECT * FROM bpCurrency;

SELECT * FROM bpUser;
SELECT * FROM bpLogin;

SELECT * FROM bpSource;
SELECT * FROM bpContainer;

SELECT * FROM bpTransaction;

SELECT * FROM bpUserContainer;
SELECT * FROM bpSourceContainer;
SELECT * FROM bpUserSourceContainer;

SELECT * FROM bpCategory;
SELECT * FROM bpContainerCategory;

SELECT UserFirstName, UserLastName, SourceName, SourceAmount
FROM bpUser
INNER JOIN bpSource
ON bpSource.UserId = bpUser.UserId;

SELECT UserFirstName, UserLastName, ContainerName, bpContainer.ContainerId
FROM bpUser
INNER JOIN bpContainer
ON bpContainer.UserId = bpUser.UserId;

-- SELECT bpContainer.ContainerName, bpContainer.UserId, bpContainerSource.ContainerId, bpContainerSource.SourceId
-- FROM bpContainer
-- INNER JOIN bpContainerSource
-- ON bpContainerSource.ContainerId = bpContainer.ContainerId;
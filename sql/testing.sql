
SELECT * FROM bpUser
INNER JOIN bpLogin 
ON bpUser.UserId = bpLogin.UserId  
WHERE bpUser.UserId = 6;


SELECT * FROM bpUser 
WHERE UserId = 6;
SELECT LoginUsername FROM bpLogin 
WHERE UserId = 6;


SELECT bpUser.UserId, 
bpUser.UserFirstName, 
bpUser.UserLastName,
bpUser.CurrencyId,
bpLogin.LoginUsername
FROM bpUser
INNER JOIN bpLogin 
ON bpUser.UserId = bpLogin.UserId  
WHERE bpUser.UserId = 7;

DELETE FROM bpLogin WHERE LoginUsername = 'testuser';
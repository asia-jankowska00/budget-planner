
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


SELECT * FROM bpUserSourceContainer
INNER JOIN bpSourceContainer
ON bpUserSourceContainer.SourceContainerId = bpSourceContainer.SourceContainerId
WHERE SourceId = 2;

SELECT *
FROM bpContainer
INNER JOIN
bpUserContainer
ON bpContainer.ContainerId = bpUserContainer.ContainerId
WHERE bpUserContainer.UserId = 1;
const bcrypt = require("bcryptjs");

const passwordsToHash = ["asia1", "alex1", "nick1", "test1", "user1"];
const hashedPasswords = [];

// const passwords =

const hashPasswords = async () => {
  return new Promise((resolve, reject) => {
    passwordsToHash.forEach((password) => {
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
          reject(err);
        } else {
          console.log(password + " : " + hash);
          hashedPasswords.push(hash);
        }
      });
    });
    resolve(hashedPasswords);
  });
};

hashPasswords();

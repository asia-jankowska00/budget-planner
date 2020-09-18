const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader ? authHeader.split(' ')[1] : undefined;

    if (!token) {
      return res.status(401).json({ message: "You need to be logged in" });
    }
  
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedUser;
    next();
  } catch (err) {
    console.log(err);
    res.status(400);
  }
}

module.exports = auth;

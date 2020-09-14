const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const authHeader = req.header("Authorization");
  const token = authHeader ? authHeader.split(' ')[1] : undefined;

  if (!token)
    return res.status(401).json({ message: "You need to be logged in" });

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedUser;
    next();
  } catch (err) {
    res.status(400);
  }
}

module.exports = auth;

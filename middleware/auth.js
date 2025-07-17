const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token eksik" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.customer = decoded; // userId ve email bilgileri burada
    next();
  } catch (err) {
    return res.status(403).json({ message: "Geçersiz token" });
  }
};

module.exports = authMiddleware;

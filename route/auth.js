const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token,'jwtkey', (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      console.log(user)
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log( req.query.userid,'====',req.user.id)
    if (req.user.id == req.query.userid || req.user.admin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

module.exports = {
  
  verifyTokenAndAuthorization
 
};
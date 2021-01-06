const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    var decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_KEY);
    next();
  } catch (err) {
    res.status(401).json({ wiadomość: 'Błąd autoryzacji' });
  }
};

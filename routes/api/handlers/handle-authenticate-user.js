const { authenticateUser } = require("../../../logic");
const jwt = require("jsonwebtoken");

const {
  env: { JWT_SECRET, JWT_EXP },
} = process;

module.exports = (req, res, handleError) => {
  const {
    body: { email, password },
  } = req;

  try {
    authenticateUser(email, password, (err, userId) => {
      if(err) return res.status(400).json(err);
      
      const token = jwt.sign({ sub: userId }, JWT_SECRET, {
        expiresIn: JWT_EXP,
      });

      res.status(200).json({ token });
    }).catch(handleError);
  } catch (error) {
    handleError(error);
  }
};

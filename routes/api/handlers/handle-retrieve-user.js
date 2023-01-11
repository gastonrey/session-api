const { retrieveUser } = require("../../../logic");

module.exports = (req, res, handleError) => {
  try {
    retrieveUser(res.locals.userId)
      .then((user) => res.status(200).json(user))
      .catch(handleError);
  } catch (error) {
    handleError(error);
  }
};

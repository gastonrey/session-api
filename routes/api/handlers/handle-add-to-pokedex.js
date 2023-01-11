const { addToPokedex } = require("../../../logic");
const { AuthError } = require("app-errors");
const { validateText } = require("../../../logic/helpers/validations");

module.exports = (req, res, handleError) => {
  const {
    body: { pokemonId },
    params: { userId },
  } = req;

  try {
    if (userId !== res.locals.userId) throw new AuthError("wrong userId");
    validateText(pokemonId);

    addToPokedex(userId, pokemonId, (err, result) => {
      if (err) return res.status(400).json(err);
      res.status(200).json(result);
    }).catch(handleError);
  } catch (error) {
    handleError(error);
  }
};

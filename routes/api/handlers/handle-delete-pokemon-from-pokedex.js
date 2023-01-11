const deletePokemonFromPokedex = require("../../../logic/delete-pokemon-from-pokedex");
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

    deletePokemonFromPokedex(userId, pokemonId, (err, result) => {
      if (err) handleError(err);
      res.status(200).json(result);
    }).catch(handleError);
  } catch (error) {
    handleError(error);
  }
};

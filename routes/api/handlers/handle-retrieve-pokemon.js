const { retrievePokemon } = require("../../../logic");

module.exports = (req, res, handleError) => {
  const {
    params: { id },
  } = req;

  try {
    retrievePokemon(id)
      .then((pokemon) => {
        res.status(200).json(pokemon);
      })
      .catch(handleError);
  } catch (error) {
    handleError(error);
  }
};

const { findPokemons } = require("../../../logic");

module.exports = (req, res, handleError) => {
  const {
    params: params,
    query: query
  } = req;

  try {
    findPokemons({...params, ...query}, (pokemons) => {
      res.status(200).json(pokemons);
    }).catch(handleError);
  } catch (error) {
    handleError(error);
  }
};

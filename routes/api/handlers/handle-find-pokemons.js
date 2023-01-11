const { findPokemons } = require("../../../logic");

module.exports = (req, res, handleError) => {
  const {
    query: query,
  } = req;

  
  try {
    findPokemons(query, (result) => {
      res.status(200).json({
        success: true,
        pokemons: result.pokemons,
        pages: result.pages,
      });
    });
  } catch (error) {
    handleError(error);
  }
};

const { savePokemon } = require("../../../logic");

module.exports = (req, res, handleError) => {
  const {
    body: { name, type, base, lang },
  } = req;

  
  try {
    savePokemon(name, type, base, lang)
      .then((pokemon) => res.status(200).json(pokemon))
      .catch(handleError);
  } catch (error) {
    handleError(error);
  }
};

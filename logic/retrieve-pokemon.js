const { NotFoundError } = require("app-errors");
const { Pokemon } = require("../models");

/**
 * Retrieves a pokemon by its id
 *
 * @param {string} pokemonId
 *
 * @returns {Promise}
 */
module.exports = function (pokemonId) {
  return Pokemon.find({ _id: pokemonId }, { __v: 0 })
    .lean()
    .then((pokemon) => {
      if (!pokemon)
        throw new NotFoundError(`pokemon with id ${pokemonId} not found`);

      return pokemon;
    });
};

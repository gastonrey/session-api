const { User } = require("../models");
const logger = require("../utils/logger");
const { ValueError } = require("app-errors");

/**
 * Removes pokemon IDs from the given user's pokedex
 *
 * @param {string} pokemonId
 *
 * @param {string} userId
 *
 * @param {callback} callback fn
 *
 * @returns {callback}
 */
module.exports = async function (userId, pokemonId, callback) {
  try {
    const res = await User.findOneAndUpdate(
      { _id: userId },
      { $pullAll: { pokedex: [pokemonId] } },
      { new: true, useFindAndModify: false, upsert: true }
    )
      .select("_id")
      .select("pokedex");

    return callback(null, res);
  } catch (error) {
    logger.log(`Error caught updating User Model: ${error}`);
    throw new ValueError("Wrong data");
  }
};

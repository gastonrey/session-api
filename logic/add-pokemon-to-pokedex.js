const { User } = require("../models");
const { ValidationError } = require("app-errors");

/**
 * Adds pokemon IDs to the given user's pokedex
 *
 * @param {string} userId
 *
 * @param {string} pokemonId
 *
 * @param {callback} callback(err, document)
 *
 * @returns {callback}
 */

const POKEDEX_LIMIT = 5;

module.exports = function (userId, pokemonId, callback) {
  return User.findOne({ _id: userId }, (err, user) => {
    if (err) return callback(err, null);
    if (user.pokedex.length >= POKEDEX_LIMIT) {
      return callback(
        { error: `Pokedex has reached its limit of ${POKEDEX_LIMIT}` },
        []
      );
    }

    return User.findOneAndUpdate(
      { _id: user._id },
      { $addToSet: { pokedex: pokemonId } },
      { new: true, useFindAndModify: false, upsert: true },
      (err, res) => {
        return callback(null, res);
      }
    )
      .select("_id")
      .select("pokedex");
  });
};

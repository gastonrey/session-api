const { ValidationError } = require("../app-errors");
const { Pokemon, User } = require("../models");
const { obtainLanguage } = require("./helpers/supportedLangs");

/**
 * Retrieves a list of filtered pokemons
 *
 * @param {object} filter
 *
 * @param {string} name
 *
 * @param {string} lang
 *
 * @param {integer} page
 *
 * @param {string} skip
 *
 * @param {integer} limit
 *
 * @param {string} sort
 *
 * @param {callback} callback
 *
 * @returns {Promise}
 */
module.exports = async function (query, callback) {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    const name = query.name || null;
    const userId = query.userId || null;
    const type = query.type || "";
    const typeFilter = {};
    const userFilter = {};

    const regex = type.split(",").join("|");
    typeFilter.type = { $regex: regex, $options: "i" };

    const plainLang = obtainLanguage(query.lang || "");
    let nameFilter = name
      ? { [`name.${plainLang}`]: new RegExp(name, "i") }
      : { [`name.${plainLang}`]: { $regex: "", $options: "i" } };

    if (userId) {
      const user = await User.findById(userId).lean();
      userFilter._id = { $in: user.pokedex };
    }

    return Pokemon.find({
      $and: [
        { $or: [typeFilter] },
        { $or: [nameFilter] },
        { $or: [userFilter] },
      ],
    })
      .skip(skip)
      .limit(limit)
      .sort(query.sort)
      .select("-base")
      .select("-__v")
      .exec((err, result) => {
        if (err) throw new ValidationError("Error occured on find document");

        Pokemon.find({
          $and: [
            { $or: [typeFilter] },
            { $or: [nameFilter] },
            { $or: [userFilter] },
          ],
        })
          .count()
          .exec(function (err, count) {
            callback({
              pokemons: result,
              current: page,
              pages: Math.ceil(count / limit),
            });
          });
      });
  } catch {
    throw new ValidationError("Error trying to apply filters");
  }
};

const { Pokemon } = require("../models");
const { obtainLanguage } = require("./helpers/supportedLangs");

/**
 * Creates a new Pokemon, name is gonna be stored based on the user's lang
 *
 * @param {string} plainName
 *
 * @param {array} type
 *
 * @param {object} base
 *
 * @param {string} lang
 *
 * @returns {Promise}
 */
module.exports = function (plainName, type, base, lang) {
  const keyLang = obtainLanguage(lang);
  const name = {
    [`${keyLang}`]: plainName,
  };

  return Pokemon.create({ name, type, base }).then((result) => result);
};

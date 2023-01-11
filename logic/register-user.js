const { validatePassword } = require("./helpers/validations");
const { ConflictError } = require("app-errors");
const { User } = require("../models");
const bcrypt = require("bcryptjs");

/**
 * Registers/creates a new user and stores its hashed password
 *
 * @param {string} fullName
 *
 * @param {string} email
 *
 * @param {string} password
 *
 * @param {array} pokedex The array of Pokemons ID that corresponds to this user
 *
 * @returns {Promise}
 */

module.exports = function (fullname, email, password, pokedex) {
  validatePassword(password);

  return User.findOne({ email })
    .then((user) => {
      if (user)
        throw new ConflictError(`user with e-mail ${email} already registered`);

      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ fullname, email, password: hash, pokedex }))
    .then((user) => user)
    .catch((err) => {
      return { error: err.message };
    });
};

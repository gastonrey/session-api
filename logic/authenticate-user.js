const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { AuthError } = require("app-errors");

/**
 * Authenticate a user by email and password
 *
 * @param {string} email
 *
 * @param {string} password
 *
 * @param {callback} callback(err, user)
 *
 * @returns {callback}
 */

module.exports = async function (email, password, callback) {
  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      return callback({ error: "Wrong user or password" }, null);
    }
    const { password: hash } = user;
    const match = await bcrypt.compare(password, hash);

    if (!match) return callback({ error: "wrong credentials" }, null);

    const { _id } = user;

    callback(null, _id);
  } catch (error) {
    throw new AuthError("Wrong parameters");
  }
};

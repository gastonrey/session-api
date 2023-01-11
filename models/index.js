const { model } = require("mongoose");
const { user, pokemon } = require("./schemas");

module.exports = {
  User: model("User", user),
  Pokemon: model("Pokemon", pokemon),
};

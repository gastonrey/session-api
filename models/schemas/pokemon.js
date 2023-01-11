const { Schema } = require("mongoose");

module.exports = new Schema({
  name: {
    type: Map,
    of: String,
    index: true
  },

  type: {
    type: [String],
    index: true
  },

  base: {
    type: Map,
    of: { type: Number },
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

require("dotenv").config();

const { expect } = require("chai");
const mongoose = require("mongoose");
const { randomStringWithPrefix } = require("../utils/randoms");
require("../utils/array-polyfills");
const savePokemon = require("./save-pokemon");
const { Pokemon } = require("../models");

const {
  env: { MONGODB_URL_TEST },
} = process;

describe("savePokemon()", () => {
  before(() => {
    mongoose.connect(MONGODB_URL_TEST, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
  });

  describe("when a pokemon is created without lang param", () => {
    let name, type, base, _id;

    beforeEach(() => {
      name = `${randomStringWithPrefix("name")}`;
      type = ["foo", "bar"];
      base = { attack: 49 };
    });

    it("by default language should be english", () => {
      return savePokemon(name, type, base)
        .then((result) => {
          _id = result._id;
          expect(result.name.get('english')).to.equal(name)
        })
    });

    afterEach(() =>
      Pokemon.deleteOne({ _id: _id }).then((result) =>
        expect(result.deletedCount).to.equal(1)
      )
    );
  });

  after(mongoose.disconnect);
});

require("dotenv").config();

const { expect } = require("chai");
const mongoose = require("mongoose");
const { randomStringWithPrefix } = require("../utils/randoms");
require("../utils/array-polyfills");
const retrievePokemon = require("./retrieve-pokemon");
const { Pokemon } = require("../models");

const {
  env: { MONGODB_URL_TEST },
} = process;

describe("retrievePokemon()", () => {
  before(() =>
    mongoose.connect(MONGODB_URL_TEST, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
  );

  describe("when a pokemon already exists", () => {
    let pkmId, name, type, base;

    beforeEach(() => {
      name = { english: `${randomStringWithPrefix("name")}` };
      type = ["foo", "bar"];
      base = { attack: 49 };

      const pokemon = { name, type, base };

      return Pokemon.create(pokemon).then((pkm) => (pkmId = pkm._id));
    });

    it("should succeed on retrieve just one by id", () => {
      return retrievePokemon(pkmId).then((p) => {
        expect(p[0].name.english).to.equal(name.english);
        expect(p[0].name).to.haveOwnProperty("english");
      });
    });

    it("base field should be present", () => {
      return retrievePokemon(pkmId).then(([{ base }]) => {
        expect(base).to.not.be.undefined;
      });
    });

    afterEach(() =>
      Pokemon.deleteOne({ _id: pkmId }).then((result) =>
        expect(result.deletedCount).to.equal(1)
      )
    );
  });

  describe("when a pokemon do not exist", () => {
    it("error message is returned", () => {
      return retrievePokemon("5fd11d9999f5460be1c80000").catch(error => {
        expect(error).to.be.instanceOf(Error)
        expect(error.message).to.equal("pokemon with id -1 not found")
      });
    });
  });

  after(mongoose.disconnect);
});

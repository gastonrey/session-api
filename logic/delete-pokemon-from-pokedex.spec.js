require("dotenv").config();

const { expect } = require("chai");
const mongoose = require("mongoose");
const deletePokemonFromPokedex = require("./delete-pokemon-from-pokedex");
const { Pokemon } = require("../models");
const { createUser, createPokemon } = require("./helpers/testHelper");

const {
  env: { MONGODB_URL_TEST },
} = process;

describe("deletePokemonFromPokedex()", () => {
  before(() => {
    return mongoose.connect(MONGODB_URL_TEST, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
  });

  describe("given when pokemons already exists", function () {
    let pkmIds, newUser, userId;

    beforeEach(async () => {
      const pokemon1 = await createPokemon();
      const pokemon2 = await createPokemon();
      const user = await createUser(true, 5);

      pkmIds = [pokemon1._id.toString(), pokemon2.id.toString()];

      userId = user._id;
      newUser = user;
    });

    it("then pokemons can be deleted from given user pokedex", () => {
      return deletePokemonFromPokedex(
        userId.toString(),
        newUser.pokedex[0],
        (err, result) => {
          expect(result.pokedex.length).to.equal(4);
        }
      );
    });

    it("then when given pokemonId do not exist nothing is done", () => {
      return deletePokemonFromPokedex(
        userId.toString(),
        "5fd39dd1ec3f65729b980fff",
        (err, result) => {
          expect(result.pokedex.length).to.equal(5);
        }
      );
    });

    it("then when given userId is invalid error message is shown", () => {
      return deletePokemonFromPokedex("123", "123").catch((err) => {
        expect(err.message).to.match(/Wrong data/);
      });
    });

    afterEach(() => {
      return Pokemon.deleteMany({
        _id: { $in: pkmIds },
      }).then((result) => expect(result.deletedCount).to.equal(2));
    });
  });

  after(mongoose.disconnect);
});

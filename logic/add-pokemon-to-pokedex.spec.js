require("dotenv").config();

const { expect } = require("chai");
const mongoose = require("mongoose");
const addPokemonToPokedex = require("./add-pokemon-to-pokedex");
const { Pokemon } = require("../models");
const { createPokemon, createUser } = require("./helpers/testHelper");

const {
  env: { MONGODB_URL_TEST },
} = process;

describe("addPokemonToPokedex()", () => {
  before(() => {
    mongoose.connect(MONGODB_URL_TEST, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
  });

  describe("given when pokemons already exists", function () {
    let pkmIds, userId;

    beforeEach(async () => {
      const pokemon1 = await createPokemon();
      const pokemon2 = await createPokemon();
      const user = await createUser();

      pkmIds = [pokemon1._id.toString(), pokemon2.id.toString()];
      userId = user._id;
    });

    it("then pokemons should be added to pokedex user", () => {
      return addPokemonToPokedex(userId, pkmIds[0], (err, result) => {
        expect(result.pokedex.length).to.equal(1);
      });
    });

    it("then same pokemon should not be repeated or added twice", () => {
      addPokemonToPokedex(userId, pkmIds[0], (err, result) => {
        expect(result.pokedex.length).to.equal(1);
      });

      return addPokemonToPokedex(userId, pkmIds[0], (err, result) => {
        expect(result.pokedex.length).to.equal(1);
      });
    });
    
    it("then when pokedex is already 5, can not add more", async () => {
      const user = await createUser(true, 5);

      return addPokemonToPokedex(user._id, pkmIds[0], ({error}, result) => {
        expect(error).to.match(/Pokedex has reached its limit of 5/)
      });
    });

    afterEach(() => {
      Pokemon.deleteMany({
        _id: { $in: pkmIds },
      }).then((result) => expect(result.deletedCount).to.equal(2));
    });
  });

  after(mongoose.disconnect);
});

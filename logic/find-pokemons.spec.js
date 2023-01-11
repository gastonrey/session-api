require("dotenv").config();

const { expect } = require("chai");
const mongoose = require("mongoose");
const findPokemons = require("./find-pokemons");
const { Pokemon } = require("../models");
const { createPokemon, createUser } = require("./helpers/testHelper");

const {
  env: { MONGODB_URL_TEST },
} = process;

describe("findPokemons()", () => {
  let pkmIds, userId, pokemon, pokemons;
  let paramsByTypeAndName = (type, name) => {
    return {
      type: type,
      name: name,
      lang: "en",
      sort: "",
      page: 1,
      limit: 10,
    };
  };

  before(async () => {
    await mongoose.connect(MONGODB_URL_TEST, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    await Pokemon.remove();
  });

  beforeEach(async () => {
    const pokemon1 = await createPokemon("english");
    const pokemon2 = await createPokemon("english");
    const user = await createUser();

    pkmIds = [pokemon1._id.toString(), pokemon2.id.toString()];
    userId = user.id;
    pokemon = pokemon1;
  });

  describe("when matching by name", () => {
    it("should succeed on filtering just one matches", () => {
      const params = paramsByTypeAndName(
        "",
        pokemon.name.get("english").slice(0, 3)
      );
      return findPokemons(params, (result) => {
        return expect(result.pokemons.length).to.equal(1);
      });
    });

    it("should retrieve all if more than one matches", () => {
      const params = paramsByTypeAndName(pokemon.type[0].slice(0, 3), "");

      return findPokemons(params, (result) => {
        expect(result.pokemons.length).to.equal(2);
      });
    });

    it("should return empty array if no matches", () => {
      return findPokemons({ type: "aaaaa", name: "raaatrt" }, (result) => {
        expect(result.pokemons.length).to.equal(0);
      });
    });

    afterEach(() =>
      Pokemon.deleteMany({ _id: { $in: pkmIds } }).then((result) =>
        expect(result.deletedCount).to.equal(2)
      )
    );
  });

  describe("when matching by type", () => {
    it("should retrieve all if more than one matches", () => {
      return findPokemons(
        paramsByTypeAndName(pokemon.type[0].slice(0, 3), ""),
        (result) => {
          expect(result.pokemons.length).to.equal(2);
        }
      );
    });

    afterEach(() =>
      Pokemon.deleteMany({ _id: { $in: pkmIds } }).then((result) =>
        expect(result.deletedCount).to.equal(2)
      )
    );
  });

  describe("when length result exceeds limit", () => {
    beforeEach(async () => {
      return await createPokemon("english", 20);
    });
    it("then more than one page is returned", () => {
      return findPokemons(paramsByTypeAndName("bar", ""), (result) => {
        expect(result.pages).to.greaterThan(1);
      });
    });

    it("then it can be paginted", () => {
      let firstPage;

      findPokemons(paramsByTypeAndName("bar", ""), (result) => {
        firstPage = result.pokemons[0]._id;
      });

      findPokemons({ ...paramsByTypeAndName("bar", ""), page: 2 }, (result) => {
        let secondPage = result.pokemons[0]._id;
        expect(firstPage).to.not.eql(secondPage);
      });
    });

    afterEach(() =>
      Pokemon.deleteMany({ _id: { $in: pkmIds } }).then((result) =>
        expect(result.deletedCount).to.equal(2)
      )
    );
  });

  describe("when limit is not specified, default is 10", () => {
    beforeEach(async () => {
      return await createPokemon("english", 20);
    });
    it("then more than one page is returned", () => {
      return findPokemons({}, (result) => {
        expect(result.pokemons.length).to.equal(10);
      });
    });

    afterEach(() =>
      Pokemon.deleteMany({ _id: { $in: pkmIds } }).then((result) =>
        expect(result.deletedCount).to.equal(2)
      )
    );
  });

  describe("when an error ocurr finding the document", () => {
    beforeEach(async () => {
      return await createPokemon("english");
    });

    describe("when type is wrong type", () => {
      it("then an error message is thrown", () => {
        return findPokemons(paramsByTypeAndName(-1, ""), () => {
          return;
        }).catch((err) =>
          expect(err).to.match(/Error trying to apply filters/)
        );
      });
    });

    describe("when name is wrong type", () => {
      it("then an error message is thrown", () => {
        return findPokemons(paramsByTypeAndName("", -1), () => {
          return;
        }).catch((err) =>
          expect(err).to.match(/Error trying to apply filters/)
        );
      });
    });

    afterEach(() =>
      Pokemon.deleteMany({ _id: { $in: pkmIds } }).then((result) =>
        expect(result.deletedCount).to.equal(2)
      )
    );
  });

  after(mongoose.disconnect);
});

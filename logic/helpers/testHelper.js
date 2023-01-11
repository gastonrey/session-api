const faker = require("faker");
const { obtainLanguage } = require("./supportedLangs");
const { Pokemon, User } = require("../../models");
const bcrypt = require("bcryptjs");

const LANGS = ["en", "jp", "zh", "fr"];
const BASE_ELEMENTS = [
  "HP",
  "Attack",
  "Defense",
  "SpAttack",
  "SpDefense",
  "Speed",
];

const randomPokemonData = (lang, qty = 1) => {
  return Array.from({ length: qty }, (_, _i) => {
    let data = {};
    const randLanguage = lang
      ? lang
      : obtainLanguage(LANGS[Math.floor(Math.random() * LANGS.length)]);

    const randBase =
      BASE_ELEMENTS[Math.floor(Math.random() * BASE_ELEMENTS.length)];

    data.name = {};
    data.name[randLanguage] = faker.name.firstName();
    data.type = faker.random.arrayElements(["Bar", "Gunner", "Shooter"], 4);
    data.base = {};
    data.base[randBase] = faker.random.number(2);
    
    return data;
  });
};

const randomUserData = (withPokedex, num) => {
  const data = {
    fullname: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: faker.internet.email(),
  };

  if (withPokedex)
    return {
      ...data,
      pokedex: Array.from({ length: num }, (_, i) => faker.random.uuid()),
    };
  return data;
};

const createPokemon = async (lang, qty, assocciateToUser) => {
  if (qty) {
    return await Pokemon.insertMany(randomPokemonData(lang, qty));
  } else {
    return await Pokemon.create(randomPokemonData(lang)[0]);
  }
};

const createUser = async (withPokedex, numOfPokedex) => {
  const password = faker.random.alphaNumeric(10);

  const hash = await bcrypt.hash(password, 10);
  const userData = randomUserData(withPokedex, numOfPokedex);

  const user = await User.create({ ...userData, password: hash });
  return { ...user._doc, plainPassword: password };
};

module.exports = { createPokemon, createUser, randomUserData };

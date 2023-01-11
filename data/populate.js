require("dotenv").config();
const { Pokemon } = require("../models");
const fs = require("fs");
const mongoose = require("mongoose");
const conn = mongoose.connection;

const {
  env: { MONGODB_URL },
} = process;


conn.on("error", (err) => {
  console.log("MongoDB Error at Connection Process...", err);
  process.exit(1);
});

conn.once("open", () => {
  console.log("MongoDB Already Connected...", mongoose.connection.name);
});


console.log('GREY --- ', MONGODB_URL)

mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const json = JSON.parse(
  fs.readFileSync(__dirname + "/DATA.json", "utf-8")
);

const modifiedJson = json.map((item) => {
  item.base.SpAttack = item["base"]["Sp. Attack"]
  delete item["base"]["Sp. Attack"]

  item.base.SpDefense = item["base"]["Sp. Defense"]
  delete item["base"]["Sp. Defense"]

  return item;
})

populateData(modifiedJson).catch((err) => console.log(err));

async function populateData(json) {
  try {
    await Pokemon.deleteMany();
    console.log("Deleting all data.");

    await Pokemon.insertMany(json);

    console.log("Data already populated into collection!!");
    process.exit();
  } catch (e) {
    console.log(e);
    process.exit();
  }
}

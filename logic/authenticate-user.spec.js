require("dotenv").config();
const faker = require("faker");
const { expect } = require("chai");
const mongoose = require("mongoose");
const authenticateUser = require("./authenticate-user");
const { User } = require("../models");

const { createUser } = require("./helpers/testHelper");

const {
  env: { MONGODB_URL_TEST },
} = process;

describe("authenticateUser()", () => {
  before(() => {
    return mongoose.connect(MONGODB_URL_TEST, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
  });

  describe("when user already exists", () => {
    let userId, user;

    beforeEach(async () => {
      user = await createUser();
      userId = user._id;

      return user;
    });

    it("should succeed on correct credentials", () => {
      return authenticateUser(user.email, user.plainPassword, (err, _id) => {
        expect(user._id.toString()).to.eql(_id.toString());
      });
    });

    describe("when wrong credentials", () => {
      it("should fail on wrong e-mail", () => {
        return authenticateUser(
          user.email.replace("@", "-"),
          user.plainPassword,
          ({ error }, _id) => {
            expect(error).to.equal("Wrong user or password");
          }
        );
      });

      it("should fail on wrong password", () => {
        return authenticateUser(user.email, -1).catch((err) => {
          expect(err).to.be.instanceOf(Error);
          expect(err.message).to.match(/Wrong parameters/);
        });
      });
    });

    afterEach(() => {
      return User.deleteOne({ _id: userId }).then((result) =>
        expect(result.deletedCount).to.equal(1)
      );
    });
  });

  describe("when user does not exist", () => {
    let email, password;

    beforeEach(() => {
      email = faker.internet.email();
      password = faker.random.number(10);
    });

    it("should fail on valid credentials", () => {
      return authenticateUser(email, password, ({ error }, _id) => {
        expect(error).to.match(/Wrong user or password/);
      });
    });
  });

  after(mongoose.disconnect);
});

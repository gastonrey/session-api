require("dotenv").config();

const faker = require("faker");
const { expect } = require("chai");
const mongoose = require("mongoose");
const registerUser = require("./register-user");
const { User } = require("../models");
const bcrypt = require("bcryptjs");

const {
  env: { MONGODB_URL_TEST },
} = process;

describe("registerUser()", () => {
  before(() =>
    mongoose.connect(MONGODB_URL_TEST, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
  );

  describe("when user does not exist", () => {
    let fullname, email, password;

    beforeEach(async () => {
      fullname = faker.name.firstName();
      email = faker.internet.email();
      password = faker.random.alphaNumeric(10);
    });

    it("then should succeed on creating new user", () =>
      registerUser(fullname, email, password)
        .then(() => User.findOne({ email }))
        .then((user) => {
          expect(user).to.exist;
          expect(user.fullname).to.equal(fullname);

          return bcrypt.compare(password, user.password);
        })
        .then((match) => expect(match).to.be.true));

    afterEach(() =>
      User.deleteOne({ email }).then((result) =>
        expect(result.deletedCount).to.equal(1)
      )
    );
  });

  describe("when user already exists", () => {
    let fullname, email, password;

    beforeEach(() => {
      fullname = faker.name.firstName();
      email = faker.internet.email();
      password = faker.random.alphaNumeric(10);

      const user = { fullname, email, password };

      return User.create(user);
    });

    it("should fail on existing user", () =>
      registerUser(fullname, email, password).catch((error) => {
        expect(error).to.be.instanceOf(Error);

        expect(error.message).to.equal(
          `user with e-mail ${email} already registered`
        );
      }));

    afterEach(() =>
      User.deleteOne({ email, password }).then((result) =>
        expect(result.deletedCount).to.equal(1)
      )
    );
  });

  describe("when fullname is wrong", () => {
    let email, password;

    beforeEach(() => {
      email = faker.internet.email();
      password = faker.random.alphaNumeric(10);
    });

    it("then a message error is thrown", () => {
      registerUser({}, email, password).catch((error) => {
        expect(error.message).to.match(/fullname: Cast to string failed/);
      });
    });
  });

  describe("when email is wrong", () => {
    let email, password;

    beforeEach(() => {
      fullname = faker.name.firstName();
      password = faker.random.alphaNumeric(10);
    });

    it("then a message error is thrown", () => {
      return registerUser(fullname, "foo-bar.com", password).catch((error) => {
        expect(error.message).to.match(
          /email: foo-bar.com is not a valid e-mail/
        );
      });
    });
  });

  describe("when password is wrong", () => {
    let email, password;

    beforeEach(() => {
      fullname = faker.name.firstName();
      email = faker.internet.email();
    });

    it("then a message error is thrown when type is no ok", () => {
      try {
        return registerUser(fullname, email, null).catch(({ error }) => {
          return;
        });
      } catch (err) {
        expect(err).to.match(/null is not a password/);
      }
    });

    it("then a message error is thrown length is empty", () => {
      try {
        return registerUser(fullname, email, "").catch(({ error }) => {
          return;
        });
      } catch (err) {
        expect(err).to.match(/password is empty/);
      }
    });
  });

  after(() => {
    User.deleteMany()
    mongoose.disconnect;
  });
});

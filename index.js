require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const { cors } = require("app-middlewares");

const {
  env: { PORT, MONGODB_URL },
  argv: [, , port = PORT || 3000],
} = process;

logger.log("starting server", "info");

mongoose
  .connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    const app = express();

    app.use(cors);

    const { api } = require("./routes");

    app.use(api);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      var err = new Error("Not Found");
      err.status = 404;
      next(err);
    });

    // error handler
    app.use(function (err, req, res, next) {
      if (err.array) {
        // validation error
        err.status = 422;
        const errInfo = err.array({ onlyFirstError: true })[0];
        err.message = `Not valid - ${errInfo.param} ${errInfo.msg}`;
      }

      res.status(err.status || 500);

      res.json({ success: false, error: err.message });
      return;
    });

    app.listen(port, () => logger.log(`server running on port ${port}`));
  })
  .catch((error) =>
    logger.log(error, "error", (error) => {
      if (error) console.error(error);

      shutDown();
    })
  );

mongoose.set("debug", true);

const shutDown = () =>
  logger.log(`stopping server`, "info", (error) => {
    if (error) console.error(error);

    if (mongoose.connection.readyState === 1)
      return mongoose
        .disconnect()
        .catch(console.error)
        .then(() => process.exit(0));

    process.exit(0);
  });

process.on("SIGINT", shutDown);

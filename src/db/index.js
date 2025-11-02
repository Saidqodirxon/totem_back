const mongoose = require("mongoose");
const config = require("../shared/config");

module.exports = function () {
  return mongoose
    .connect(config.db.mongdb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB connect.");
    })
    .catch((err) => {
      console.log("DB error: ", err);
    });
};

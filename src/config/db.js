const mongoose = require("mongoose");
const { DB_URL } = require("../helpers/env");

mongoose
  .connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log("db disconnect");
    console.log(err);
  });

module.exports = mongoose;

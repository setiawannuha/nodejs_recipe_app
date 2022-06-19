require("dotenv").config();

module.exports = {
  APP_PORT: process.env.APP_PORT,
  DB_URL: process.env.DB_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
};

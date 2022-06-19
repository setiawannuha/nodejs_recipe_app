const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const xss = require("xss-clean");
const { APP_PORT, SESSION_SECRET } = require("./src/helpers/env");
const router = require("./src/routes");
const path = require("path");
const sessions = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors());
app.use(xss());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  sessions({
    secret: SESSION_SECRET,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
    resave: false,
  })
);
app.use(cookieParser());

app.use("/css", express.static(__dirname + "/public/css"));
app.use("/images", express.static(__dirname + "/public/images"));
app.set("views", "./src/views");
app.set("view engine", "ejs");
app.use(router);

const PORT = APP_PORT || 3002;
app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});

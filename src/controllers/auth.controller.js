const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { internalError, failed } = require("../helpers/response");
module.exports = {
  login: (req, res) => {
    const session = req.session.user;
    res.render("auth/login", {
      session,
    });
  },
  register: (req, res) => {
    const session = req.session.user;
    res.render("auth/register", {
      session,
    });
  },
  store: async (req, res) => {
    try {
      const session = req.session.user;
      const { fullname, email, password, confirm_password } = req.body;
      if (password === confirm_password) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const user = await User.create({
          fullname,
          email,
          password: hash,
        });
        res.render("auth/register", {
          message: "Register Success",
          session,
        });
        return;
      } else {
        failed(res, "Password doesn't match");
        return;
      }
    } catch (err) {
      console.log(err);
      const error = err.message || "Internal server error";
      failed(res, error);
      return;
    }
  },
  authenticate: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          let session = req.session;
          session.user = user;
          res.redirect("/");
        } else {
          failed(res, "Password wrong");
          return;
        }
      } else {
        failed(res, "User not found");
        return;
      }
    } catch (err) {
      console.log(err);
      const error = err.message || "Internal server error";
      failed(res, error);
      return;
    }
  },
  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/login");
  },
};

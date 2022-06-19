const { failed } = require("../helpers/response");
module.exports = {
  needLogin: (req, res, next) => {
    try {
      const session = req.session.user;
      if (session) {
        next();
      } else {
        res.redirect("/");
      }
    } catch (err) {
      res.redirect("/");
    }
  },
  public: (req, res, next) => {
    try {
      const session = req.session.user;
      if (!session) {
        next();
      } else {
        res.redirect("/");
      }
    } catch (err) {
      res.redirect("/");
    }
  },
};

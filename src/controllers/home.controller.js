const Recipe = require("../models/recipe.model");
const { internalError, failed } = require("../helpers/response");

module.exports = {
  index: async (req, res) => {
    try {
      const session = req.session.user;
      const banner = await Recipe.findOne().sort({ createdAt: -1 });
      const latest = await Recipe.find()
        .populate("user")
        .sort({ createdAt: -1 })
        .limit(3);
      const recipes = await Recipe.find().populate("user").limit(6);
      res.render("home/index", {
        session,
        banner,
        latest,
        recipes,
      });
    } catch (err) {
      console.log(err);
      const error = err.message || "Internal server error";
      failed(res, error);
      return;
    }
  },
  about: async (req, res) => {
    try {
      const session = req.session.user;
      res.render("home/about", {
        session,
      });
    } catch (err) {
      console.log(err);
      const error = err.message || "Internal server error";
      failed(res, error);
      return;
    }
  },
};

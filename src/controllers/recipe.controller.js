const Recipe = require("../models/recipe.model");
const { internalError, failed } = require("../helpers/response");
const moment = require("moment");
module.exports = {
  index: async (req, res) => {
    try {
      const { search, page } = req.query;
      const searchValue = search || "";
      const pageValue = parseInt(page) || 1;
      const limit = 12;
      const offset = pageValue === 1 ? 0 : (pageValue - 1) * limit;
      const session = req.session.user;
      const allRecipes = await Recipe.find({
        title: { $regex: ".*" + searchValue + ".*" },
      });
      const recipes = await Recipe.find({
        title: { $regex: ".*" + searchValue + ".*" },
      })
        .limit(limit)
        .skip(offset)
        .populate("user")
        .exec();
      const pagination = {
        page: pageValue,
        limit,
        pages: Math.ceil(allRecipes.length / limit),
        total: allRecipes.length,
      };
      res.render("recipe/index", {
        session,
        recipes,
        search: searchValue,
        pagination,
      });
    } catch (err) {
      console.log(err);
      const error = err.message || "Internal server error";
      failed(res, error);
      return;
    }
  },
  my: async (req, res) => {
    try {
      const session = req.session.user;
      const recipes = await Recipe.find({ user: session._id })
        .populate("user")
        .exec();
      res.render("recipe/my", {
        session,
        recipes,
      });
    } catch (err) {
      console.log(err);
      const error = err.message || "Internal server error";
      failed(res, error);
      return;
    }
  },
  detail: async (req, res) => {
    try {
      const id = req.params.id;
      const session = req.session.user;
      const recipe = await Recipe.findById(id).populate("user").exec();
      res.render("recipe/detail", {
        session,
        recipe,
        moment,
      });
    } catch (err) {
      console.log(err);
      const error = err.message || "Internal server error";
      failed(res, error);
      return;
    }
  },
  insert: (req, res) => {
    try {
      const session = req.session.user;
      res.render("recipe/insert", {
        session,
      });
    } catch (err) {
      console.log(err);
      const error = err.message || "Internal server error";
      failed(res, error);
      return;
    }
  },
  store: async (req, res) => {
    try {
      const session = req.session.user;
      const { title, description, ingredient, intruction } = req.body;
      const filename = req.file.filename;
      const userId = session._id;
      const recipeSchema = new Recipe();
      recipeSchema.user = userId;
      recipeSchema.title = title;
      recipeSchema.description = description;
      recipeSchema.image = filename;
      recipeSchema.ingredients = ingredient;
      recipeSchema.intructions = intruction;
      recipeSchema.save((err, result) => {
        if (err) {
          console.log(err);
          failed(res, "Failed insert recipe");
          return;
        }
        res.redirect("/my-recipe");
      });
    } catch (err) {
      console.log(err);
      const error = err.message || "Internal server error";
      failed(res, error);
      return;
    }
  },
  edit: async (req, res) => {
    try {
      const id = req.params.id;
      const session = req.session.user;
      const recipe = await Recipe.findOne({
        _id: id,
        user: session._id,
      }).exec();
      if (recipe) {
        res.render("recipe/edit", {
          session,
          recipe,
        });
      } else {
        failed(res, "You dont have access");
        return;
      }
    } catch (err) {
      console.log(err);
      const error = err.message || "Internal server error";
      failed(res, error);
      return;
    }
  },
  update: async (req, res) => {
    try {
      const id = req.params.id;
      const recipe = await Recipe.findById(id).exec();
      const session = req.session.user;
      const { title, description, ingredient, intruction } = req.body;
      const filename = req.file ? req.file.filename : recipe.image;
      const userId = session._id;
      const recipeSchema = await Recipe.findById(id);
      recipeSchema.user = userId;
      recipeSchema.title = title;
      recipeSchema.description = description;
      recipeSchema.image = filename;
      recipeSchema.ingredients = ingredient;
      recipeSchema.intructions = intruction;
      recipeSchema.save((err, result) => {
        if (err) {
          console.log(err);
          failed(res, "Failed update recipe");
          return;
        }
        res.redirect("/my-recipe");
      });
    } catch (err) {
      console.log(err);
      const error = err.message || "Internal server error";
      failed(res, error);
      return;
    }
  },
  destroy: async (req, res) => {
    try {
      const id = req.params.id;
      const session = req.session.user;
      const recipe = await Recipe.findOne({
        _id: id,
        user: session._id,
      }).exec();
      if (recipe) {
        Recipe.deleteOne({ _id: id }, (err, _) => {
          if (err) {
            console.log(err);
            failed(res, "Failed update recipe");
            return;
          }
          res.redirect("/my-recipe");
        });
      } else {
        failed(res, "You dont have access");
        return;
      }
    } catch (err) {
      console.log(err);
      const error = err.message || "Internal server error";
      failed(res, error);
      return;
    }
  },
};

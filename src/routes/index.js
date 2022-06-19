const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const homeController = require("../controllers/home.controller");
const recipeController = require("../controllers/recipe.controller");
const { needLogin, public } = require("../middlewares/auth");
const uploadFile = require("../helpers/upload");

router.get("/", homeController.index);
router.get("/about", homeController.about);
router.get("/recipe", recipeController.index);
router.get("/my-recipe", needLogin, recipeController.my);
router.get("/insert-recipe", needLogin, recipeController.insert);
router.post("/insert-recipe", needLogin, uploadFile, recipeController.store);
router.get("/edit-recipe/:id", needLogin, recipeController.edit);
router.post("/edit-recipe/:id", needLogin, uploadFile, recipeController.update);
router.get("/delete-recipe/:id", needLogin, recipeController.destroy);
router.get("/detail-recipe/:id", recipeController.detail);
router.get("/login", public, authController.login);
router.get("/register", public, authController.register);
router.post("/register", public, authController.store);
router.post("/login", public, authController.authenticate);
router.get("/logout", needLogin, authController.logout);

module.exports = router;

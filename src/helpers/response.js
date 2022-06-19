module.exports = {
  internalError: (res, error) => {
    res.render("error/internal", {
      data: {
        error: "500 Internal Server Error",
      },
    });
  },
  failed: (res, error) => {
    res.render("error/internal", {
      data: {
        error,
      },
    });
  },
};

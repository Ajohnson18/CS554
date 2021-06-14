const homeRoutes = require("./home");

const constructorMethod = (app) => {
  app.use("/", homeRoutes);

  app.use("*", (req, res) => {
    res.status(404).render("404");
  });
};

module.exports = constructorMethod;

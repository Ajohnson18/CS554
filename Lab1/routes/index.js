const movies = require("./movies");

const contructorMethod = (app) => {
  app.use("/api/movies", movies);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Page not found" });
  });
};

module.exports = contructorMethod;

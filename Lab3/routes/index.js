const shows = require("./shows");

const contructorMethod = (app) => {
  app.use("/", shows);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Page not found" });
  });
};

module.exports = contructorMethod;

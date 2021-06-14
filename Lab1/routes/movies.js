const { request } = require("express");
const express = require("express");
const router = express.Router();
const data = require("../data");
const movieData = data.movies;
const commentData = data.comments;

router.get("/", async (req, res) => {
  let start = 0;
  let end = 20;
  if (req.query.skip) {
    start = parseInt(req.query.skip);
    if (typeof start != "number")
      return res.status(400).json({ error: "Skip query must be a number" });
  }
  if (req.query.take) {
    end = parseInt(req.query.take);
    if (typeof end != "number")
      return res.status(400).json({ error: "Take query must be a number" });
  }
  try {
    const movies = await movieData.getAll(start, end);
    res.status(200).json(movies);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await movieData.get(req.params.id);
    res.status(200).json(movie);
  } catch (e) {
    res.status(e.http_code).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  let info = req.body;
  if (!info) {
    res.status(400).json({ error: "Data must be provided to add to database" });
    return;
  }
  if (!info.title) {
    res.status(400).json({ error: "Movie must include a title" });
    return;
  }
  if (!info.cast) {
    res.status(400).json({ error: "Movie must include a cast" });
    return;
  }
  if (!info.info) {
    res.status(400).json({ error: "Movie must include info" });
    return;
  }
  if (!info.plot) {
    res.status(400).json({ error: "Movie must include a plot" });
    return;
  }
  if (!info.rating) {
    res.status(400).json({ error: "Movie must include a rating" });
    return;
  }
  try {
    let result = await movieData.create(info);
    res.status(200).json(result);
  } catch (e) {
    res.status(e.http_code).json({ error: e.message });
  }
});

router.put("/:id", async (req, res) => {
  let info = req.body;
  if (!info) {
    res.status(400).json({ error: "Data must be provided to add to database" });
    return;
  }
  if (!info.title) {
    res.status(400).json({ error: "Movie must include a title" });
    return;
  }
  if (!info.cast) {
    res.status(400).json({ error: "Movie must include a cast" });
    return;
  }
  if (!info.plot) {
    res.status(400).json({ error: "Movie must include a plot" });
    return;
  }
  if (!info.rating) {
    res.status(400).json({ error: "Movie must include a rating" });
    return;
  }
  try {
    let res2 = await movieData.updateAll(info, req.params.id);
    res.status(200).json(res2);
  } catch (e) {
    res.status(e.http_code).json({ error: e.message });
  }
});

router.patch("/:id", async (req, res) => {
  let info = req.body;
  if (!info) {
    res.status(400).json({ error: "Data must be provided to update database" });
    return;
  }
  try {
    let result = await movieData.updateSome(info, req.params.id);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/:id/comments", async (req, res) => {
  let info = req.body;
  if (!info) {
    res.status(400).json({ error: "Data must be provided to create comment" });
    return;
  }
  if (!info.name) {
    res.status(400).json({ error: "Comment must include a name" });
    return;
  }
  if (!info.comment) {
    res.status(400).json({ error: "Comment must include a body" });
    return;
  }
  try {
    let result = await commentData.create(info, req.params.id);
    res.status(200).json(result);
  } catch (e) {
    res.status(e.http_code).json({ error: e.message });
  }
});

router.delete("/:movieId/:commentId", async (req, res) => {
  try {
    let result = await commentData.remove(
      req.params.movieId,
      req.params.commentId
    );
    res.status(200).json({ deletedId: result });
  } catch (e) {
    res.status(e.http_code).json({ error: e.message });
  }
});

module.exports = router;

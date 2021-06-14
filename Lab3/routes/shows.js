const express = require("express");
const router = express.Router();
const axios = require("axios");
const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();
const redisSortedSet = require("redis-sorted-set");

let sortedSet = new redisSortedSet();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const URL = "http://api.tvmaze.com/shows";

async function getAllShows() {
  const { data } = await axios.get(URL);
  return data;
}

async function getShowById(id) {
  const { data } = await axios.get(URL + "/" + id);
  return data;
}

async function getTVByKeyword(key) {
  const url = "http://api.tvmaze.com/search/shows?q=" + key;
  const { data } = await axios.get(url);
  return data;
}

router.get("/", async (req, res) => {
  try {
    let exists = await client.getAsync("homePage");
    if (exists) {
      res.send(exists, 200);
    } else {
      let data = await getAllShows();
      res
        .status(200)
        .render("home", { shows: data }, async function (err, html) {
          await client.setAsync("homePage", html);
          res.send(html, 200);
        });
    }
  } catch (e) {
    res.status(400).render("indiv", { error: "Internal Error" });
  }
});

router.get("/show/:id", async (req, res) => {
  try {
    let exists = await client.getAsync(req.params.id);
    if (exists) {
      res.send(exists, 200);
    } else {
      let data = await getShowById(req.params.id);
      if (data) {
        res.render("indiv", { show: data }, async function (err, html) {
          await client.setAsync(req.params.id, html);
          res.send(html, 200);
        });
      } else {
        res
          .status(404)
          .render("indiv", { error: "This id is not correlated with a show" });
      }
    }
  } catch (e) {
    res.status(404).render("indiv", { error: "Page not found" });
  }
});

router.post("/search", async (req, res) => {
  try {
    if (req.body.searchTerm.trim().length == 0 || !req.body.searchTerm) {
      res
        .status(400)
        .render("search", { error: "Please provide a search term" });
    } else {
      if (sortedSet.has(req.body.searchTerm)) {
        sortedSet.set(
          req.body.searchTerm,
          sortedSet.get(req.body.searchTerm) + 1
        );
        let exists = await client.getAsync(req.body.searchTerm);
        res.send(exists, 200);
      } else {
        sortedSet.add(req.body.searchTerm, 1);
        const tv = await getTVByKeyword(req.body.searchTerm);
        res.render("search", { shows: tv }, async function (err, html) {
          await client.setAsync(req.body.searchTerm, html);
          res.send(html, 200);
        });
      }
    }
  } catch (e) {
    res.status(400).render("indiv", { error: "Internal Error" });
  }
});

router.get("/popularsearches", async (req, res) => {
  try {
    let result = sortedSet.range(0, 9);
    res.status(200).render("top", { terms: result.reverse() });
  } catch (e) {
    res.status(400).render("indiv", { error: "Internal Error" });
  }
});

module.exports = router;

const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const movies = mongoCollections.movies;
const ObjectId = require("mongodb").ObjectID;
const helper = require("./_helper");
const utils = require("./_utils");

async function create(body, id) {
  const name = body.name;
  const com = body.comment;
  utils.checkParams(utils.checkString, { name, com });
  const newObj = await helper.create(comments, body, "comment");
  const movie = await helper.getById(movies, id, "movie");
  movie.comments = movie.comments.concat([newObj]);

  return await helper.update(movies, id, movie, "movie");
}

async function remove(movieid, commentid) {
  const movie = await helper.getById(movies, movieid, "movie");
  let obj = [];
  for (let i = 0; i < movie["comments"].length; i++) {
    if (movie["comments"][i]["_id"] != commentid) {
      obj.concat([movie["comments"][i]]);
    }
  }
  movie["comments"] = obj;
  await helper.update(movies, movieid, movie, "movie");
  return await helper.remove(comments, commentid, "comment");
}

module.exports = {
  create,
  remove,
};

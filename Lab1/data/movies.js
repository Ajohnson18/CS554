const mongoCollections = require("../config/mongoCollections");
const movies = mongoCollections.movies;
const ObjectId = require("mongodb").ObjectID;
const helper = require("./_helper");
const utils = require("./_utils");

async function getAll(start, end) {
  const result = await helper.getAll(movies);
  let output = [];
  for (let i = start; i < end + start && i < result.length && i < 100; i++) {
    output.push(result[i]);
  }
  return output;
}

async function get(id) {
  return await helper.getById(movies, id, "movie");
}

async function create(body) {
  const title = body.title;
  const cast = body.cast;
  const info = body.info;
  const plot = body.plot;
  const rating = body.rating;
  let director = "";
  let year = -1;
  try {
    director = info.director;
    year = info.yearReleased;
  } catch (e) {
    throw "Info needs data";
  }
  utils.checkParams(utils.checkString, { title, plot, director });
  utils.checkParams(utils.checkNumber, { rating, year });
  utils.checkParams(utils.checkArray, { cast });
  utils.checkParams(utils.checkObject, { info });
  if (cast.length == 0) throw "Cast cannot be empty";
  for (let i = 0; i < cast.length; i++) {
    let sing = cast[i];
    let firstname = "";
    let lastname = "";
    try {
      firstname = sing.firstName;
      lastname = sing.lastName;
    } catch (e) {
      throw "Cast needs first and last name";
    }
    utils.checkParams(utils.checkString, { firstname, lastname });
  }
  body["comments"] = [];
  return await helper.create(movies, body, "movie");
}

async function updateAll(body, id) {
  const title = body.title;
  const cast = body.cast;
  const info = body.info;
  const plot = body.plot;
  const rating = body.rating;
  let director = "";
  let year = -1;
  try {
    director = info.director;
    year = info.yearReleased;
  } catch (e) {
    throw "Info needs data";
  }
  utils.checkParams(utils.checkString, { title, plot, director });
  utils.checkParams(utils.checkNumber, { rating, year });
  utils.checkParams(utils.checkArray, { cast });
  utils.checkParams(utils.checkObject, { info });
  if (cast.length == 0) throw "Cast cannot be empty";
  for (let i = 0; i < cast.length; i++) {
    let sing = cast[i];
    let firstname = "";
    let lastname = "";
    try {
      firstname = sing.firstName;
      lastname = sing.lastName;
    } catch (e) {
      throw "Cast needs first and last name";
    }
    utils.checkParams(utils.checkString, { firstname, lastname });
  }
  return await helper.update(movies, id, body, "movie");
}

async function updateSome(body, id) {
  return await helper.update(movies, id, body, "movie");
}

module.exports = {
  getAll,
  get,
  create,
  updateAll,
  updateSome,
};

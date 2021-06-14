const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();
const uuid = require("uuid");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

async function upload(url, description, posterName) {
  try {
    let post = {
      id: uuid.v4(),
      description: description,
      url: url,
      posterName: posterName,
      binned: false,
      userPosted: true,
    };
    let check = await client.existsAsync("user");
    if (check == 1) {
      let posts = await client.getAsync("user");
      let parsed = JSON.parse(posts);
      parsed.push(post);
      await client.setAsync("user", JSON.stringify(parsed));
    } else {
      await client.setAsync("user", JSON.stringify([post]));
    }
    return post;
  } catch (e) {
    console.log(e);
  }
}

async function getCachedBinned() {
  try {
    let check = await client.existsAsync("user");
    if (check != 1) {
      return [];
    } else {
      let posts = await client.getAsync("user");
      let data = JSON.parse(posts);
      let res = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].id == undefined) continue;
        if (data[i].binned) {
          res.push(data[i]);
        }
      }
      return res;
    }
  } catch (e) {
    console.log(e);
  }
}

async function getCachedPosted() {
  try {
    let check = await client.existsAsync("user");
    if (check != 1) {
      return [];
    } else {
      let posts = await client.getAsync("user");
      let data = JSON.parse(posts);
      let res = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].id == undefined) continue;
        if (data[i].userPosted) {
          res.push(data[i]);
        }
      }
      return res;
    }
  } catch (e) {
    console.log(e);
    return [];
  }
}

async function update(id, url, description, posterName, userPosted, binned) {
  try {
    let check = await client.existsAsync("user");
    let fin = {};
    if (check == 1) {
      let posts_data = await client.getAsync("user");
      let posts = JSON.parse(posts_data);
      let data = [];
      for (let i = 0; i < posts.length; i++) {
        let obj = {};
        if (posts[i].id == id) {
          obj["id"] = id;
          if (!url) {
            obj["url"] = posts[i]["url"];
          } else {
            obj["url"] = url;
          }
          if (!description) {
            obj["description"] = posts[i].description;
          } else {
            obj["description"] = description;
          }

          obj["posterName"] = posterName ? posterName : posts[i].posterName;

          if (typeof userPosted == "boolean") {
            obj["userPosted"] = userPosted;
          } else {
            obj["userPosted"] = posts[i].userPosted;
          }

          if (typeof binned == "boolean") {
            if (!binned && !posts[i].userPosted) {
              continue;
            }
            obj["binned"] = binned;
          } else {
            obj["binned"] = posts.binned;
          }
          fin = obj;
          data.push(obj);
        } else {
          data.push(posts[i]);
        }
      }
      await client.setAsync("user", JSON.stringify(data));
      if (!fin["id"]) fin["id"] = id;
      if (!fin["url"]) fin["url"] = "";
      if (!fin["posterName"]) fin["posterName"] = "";
      return fin;
    } else {
      return;
    }
  } catch (e) {
    console.log(e);
    return;
  }
}

async function deleteImage(id) {
  try {
    let check = await client.existsAsync("user");
    if (check == 1) {
      let posted_data = await client.getAsync("user");
      let posts = JSON.parse(posted_data);
      let data = [];
      let deleted = {};
      for (let i = 0; i < posts.length; i++) {
        if (posts[i].id == undefined) continue;
        console.log(posts[i].id);
        console.log("SAD  " + id);
        if (posts[i].id == id) {
          deleted = posts[i];
          continue;
        }
        data.push(posts[i]);
      }
      await await client.setAsync("user", JSON.stringify(data));
      if (!deleted["id"]) deleted["id"] = id;
      if (!deleted["url"]) deleted["url"] = "";
      if (!deleted["posterName"]) deleted["posterName"] = "";
      return deleted;
    } else {
      return;
    }
  } catch (e) {
    console.log(e);
    return;
  }
}

module.exports = {
  upload,
  getCachedBinned,
  getCachedPosted,
  update,
  deleteImage,
};

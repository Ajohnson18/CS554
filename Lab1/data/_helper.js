const utils = require("./_utils");

async function create(collection, obj, name) {
  const col = await collection();
  let result = {};
  try {
    result = await col.insertOne(obj);
  } catch (e) {
    throw e.message;
  }
  if (result.insertedCount == 0) throw `Could not create new ${name}`;
  return await getById(collection, result.insertedId, name);
}

async function remove(collection, id, objName) {
  utils.checkParams(utils.checkStringIsObjectId, { id });
  let col = null;
  try {
    col = await collection();
  } catch (e) {
    throw e.message;
  }
  const result = await col.deleteOne({ _id: utils.toObjectId(id) });
  if (result.deletedCount === 0) throw `Could not delete ${objName}`;
  return id;
}

async function getById(collection, id, objName) {
  const col = await collection();
  let result = {};
  try {
    result = await col.findOne({ _id: utils.toObjectId(id) });
  } catch (e) {
    throw e.message;
  }
  if (result == null) throw `No ${objName} found for given id`;
  return result;
}

async function getAll(collection) {
  const col = await collection();
  try {
    return await col.find({}).toArray();
  } catch (e) {
    throw e.message;
  }
}

async function update(collection, id, params, objName) {
  utils.checkParams(utils.checkStringIsObjectId, { id });
  const col = await collection();
  let result = {};
  try {
    result = await col.updateOne(
      { _id: utils.toObjectId(id) },
      { $set: params }
    );
  } catch (e) {
    throw e.message;
  }
  if (result.modifiedCount === 0) throw `Could not updated ${objName}`;
  return await getById(collection, id, objName);
}

module.exports = {
  create,
  remove,
  getById,
  getAll,
  update,
};

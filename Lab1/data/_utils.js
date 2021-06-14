const { ObjectId } = require("mongodb");

function checkParams(fn, params) {
  const keys = Object.keys(params);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    fn(keys[i], params[key]);
  }
}

function checkString(paramName, paramValue) {
  if (
    paramName == null ||
    typeof paramValue != "string" ||
    paramValue == null ||
    paramValue.trim() == ""
  )
    throw `${paramName} is not a valid string or is empty.`;
}

function checkNumber(paramName, paramValue) {
  if (
    paramName == null ||
    typeof paramValue != "number" ||
    paramValue == null ||
    paramValue < 0
  )
    throw `${paramName} is not a valid number.`;
}

function checkObject(paramName, paramValue) {
  if (
    paramName == null ||
    typeof paramValue != "object" ||
    paramValue == null ||
    paramValue == {}
  )
    throw `${paramName} is not a valid object or does not contain the necessary information.`;
}

function checkArray(paramName, paramValue) {
  if (
    paramName == null ||
    !Array.isArray(paramValue) ||
    paramValue == null ||
    paramValue == []
  )
    throw `${paramName} is not a valid array or does not contain the necessary information.`;
}

function checkStringIsObjectId(paramName, paramValue) {
  checkString(paramName, paramValue);
  if (!ObjectId.isValid(paramValue))
    throw `${paramValue} is not a valid ObjectId`;
}

function toObjectId(stringId) {
  return ObjectId(stringId);
}

module.exports = {
  checkString,
  checkArray,
  checkNumber,
  checkObject,
  checkParams,
  checkStringIsObjectId,
  toObjectId,
};

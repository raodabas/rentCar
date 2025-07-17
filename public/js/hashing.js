const { hash } = require("bcrypt");

exports.doHash = (value, saltValue) => {
  const result = hash(value, saltValue);
  return result;
};

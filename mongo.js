const mongoose = require("mongoose");

/**
 * @param {String} connectionString
 * @param {Object} connectionOptions
 * @returns {null}
 */
const mongo = (connectionString, connectionOptions) => {
  mongoose.connect(connectionString, connectionOptions).catch((e) => {
    console.error(`${`${e}`.red}`);
    process.exit(1);
  });
};

module.exports = mongo;

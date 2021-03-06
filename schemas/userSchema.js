const { Schema, model } = require("mongoose");

/**
 * @param {Number} defaultNumber
 */
function returnDefaultNumber(defaultNumber) {
  return {
    type: Number,
    default: defaultNumber,
  };
}

const userSchema = Schema({
  id: {
    type: String,
    required: true,
  },
  blacklisted: {
    type: Boolean,
    default: false,
  },
  coins: returnDefaultNumber(250),
  vault: returnDefaultNumber(0),
  vault_max: returnDefaultNumber(0),
  vault_level: returnDefaultNumber(1),
  passive: {
    type: Boolean,
    default: false,
  },
  nickname: {
    type: String,
    default: "User",
  },
  color: {
    type: String,
    default: "#000000",
  },
  startedAt: {
    type: Number,
    default: 0,
  },
  message: {
    type: String,
    default: "",
  },
  lastDaily: {
    type: Number,
    default: 0,
  },
  inventory: {
    type: Object,
    default: {
      computers: 0,
      padlocks: 0,
    }
  }
});

module.exports = model("users", userSchema);

module.exports = {
  name: "disconnecting",
  once: false,
  execute() {
    console.log("Disconnecting from MongoDB...".yellow);
  },
};

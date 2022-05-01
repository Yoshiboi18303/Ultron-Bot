module.exports = {
  name: "disconnected",
  once: false,
  execute() {
    console.log("Disconnected from MongoDB!".red);
  },
};

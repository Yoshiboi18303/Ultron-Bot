module.exports = {
  name: "reconnectFailed",
  once: false,
  execute() {
    console.log("Failed to reconnect to MongoDB...".red);
    process.exit();
  },
};

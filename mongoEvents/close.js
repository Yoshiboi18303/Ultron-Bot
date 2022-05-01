module.exports = {
  name: "close",
  once: false,
  execute() {
    console.log("Connection to MongoDB sucessfully closed.".red);
  },
};

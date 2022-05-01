module.exports = {
  name: "reconnected",
  once: false,
  execute() {
    console.log("Successfully reconnected to MongoDB!".green);
  },
};

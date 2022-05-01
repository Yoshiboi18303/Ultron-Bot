module.exports = class Debug {
  constructor(info) {
    this.info = info;

    if (!this.info) throw new Error("This class needs some debug info!");

    const text = "ULTRON-DEBUGGER:".yellow;
    console.log(
      text,
      `${`${this.info}`.blue}` +
        "\n\n-------------------------------------------------------------\n"
    );
  }
};

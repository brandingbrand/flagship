class Warning extends Error {
  constructor(message: string) {
    super(message);

    this.name = "Warning";
  }
}

export default Warning;

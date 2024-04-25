module.exports = {
  appenders: {
    ConsoleLogAppender: {
      type: "console"
    }
  },
  categories: {
    "default": {
      appenders: ["ConsoleLogAppender"],
      level: "ALL"
    }
  }
};
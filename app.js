const PORT = process.env.PORT;
const path = require("path");
const logger = require("./lib/log/logger.js");
const applicationLogger = require("./lib/log/applicationlogger.js");
const accessLogger = require("./lib/log/accessloger.js");
const express = require("express");
const favicon = require("serve-favicon");
const app =  express();

// EXpressの設定
app.set("view engine", "ejs");
app.disable("x-powered-by");

// 静的情報
app.use(favicon(path.join(__dirname, "/public/favicon.ico")));
app.use("/public", express.static(path.join(__dirname, "/public")));
// accessロガー
app.use(accessLogger());
// ルーティング
app.use("/shops", require("./routes/shops.js"));
app.use("/", require("./routes/index.js"));


app.use("/test", async(req, res, next) => {
  const { MySQLClient, sql } = require("./lib/database/client.js");
  var data;
  try {
    data = await MySQLClient.executeQuery(await sql(await "SELECT_SHOP_BASIC_BY_ID"), [1]);
    console.log(data);
  } catch (err) {
    next(err);
  }

  res.end("OK");
});
// アプリケーションのロガー
app.use(applicationLogger());
// アプリケーションの実行
app.listen((PORT), ()=> {
  logger.application.info(`Application listening at ${PORT}`);
});


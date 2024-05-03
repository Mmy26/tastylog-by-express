const PORT = process.env.PORT;
const path = require("path");
const logger = require("./lib/log/logger.js");
const applicationLogger = require("./lib/log/applicationlogger.js");
const accessLogger = require("./lib/log/accessloger.js");
const express = require("express");
const favicon = require("serve-favicon");
const cookie = require("cookie-parser");
const app =  express();

// EXpressの設定
app.set("view engine", "ejs");
app.disable("x-powered-by");

// グローバルメソッドをview engineで読み込み
app.use((req, res, next) => {
  res.locals.moment = require("moment");
  res.locals.padding = require("./lib/math/math.js").padding;
  next();
});

// 静的情報
app.use(favicon(path.join(__dirname, "/public/favicon.ico")));
app.use("/public", express.static(path.join(__dirname, "/public")));
// accessロガー
app.use(accessLogger());
// ミドルミェアの設定
app.use(cookie());
app.use(express.urlencoded({ extended: true }));

// ルーティング
app.use("/account", require("./routes/account.js"));
app.use("/search", require("./routes/search.js"));
app.use("/shops", require("./routes/shops.js"));
app.use("/", require("./routes/index.js"));

// アプリケーションのロガー
app.use(applicationLogger());
// アプリケーションの実行
app.listen((PORT), ()=> {
  logger.application.info(`Application listening at ${PORT}`);
});


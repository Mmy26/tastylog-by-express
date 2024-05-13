const IS_PRODUCTION = process.env.NODE_ENV === "production";
const appconfig = require("./config/application.config.js");
const dbconfig = require("./config/mysql.config.js");
const path = require("path");
const logger = require("./lib/log/logger.js");
const accesslogger = require("./lib/log/accessloger.js");
const applicationlogger = require("./lib/log/applicationlogger.js");
const accesscontrol = require("./lib/security/accesscontrol.js");
const express = require("express");
const favicon = require("serve-favicon");
const cookie = require("cookie-parser");
const session = require("express-session");
const MySQlStore = require("express-mysql-session")(session);
const flash = require("connect-flash");
const app = express();

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
app.use(accesslogger());

// ミドルミェアの設定
app.use(cookie());
app.use(session({
  store: new MySQlStore({
    host: dbconfig.HOST,
    port: dbconfig.PORT,
    user: dbconfig.USERNAME,
    password: dbconfig.PASSWORD,
    database: dbconfig.DATABASE
  }),
  cookie: {
    secure: IS_PRODUCTION
  },
  secret: appconfig.security.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // 初めてアクセスしてきた人にセッションを張らないようにする
  name: "sid"
}));
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(...accesscontrol.initialize());

// ルーティング
app.use("/", (() => {
  // クリックジャッキング対策でX-Frame-Optionsをすべての画面に対し表示させる
  const router = express.Router();
  router.use((req, res, next)=> {
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    next();
  });
  router.use("/account", require("./routes/account.js"));
  router.use("/search", require("./routes/search.js"));
  router.use("/shops", require("./routes/shops.js"));
  router.use("/test", ()=> {throw new Error("test error");});
  router.use("/", require("./routes/index.js"));
  return router;
})());

// アプリケーションのロガー
app.use(applicationlogger());

// カスタムエラーページ
app.use((req, res, next) => {
  res.status(404);
  res.render("./404.ejs");
});
app.use((err, req, res, next) => {
  res.status(500);
  res.render("./500.ejs");
});

// アプリケーションの実行
app.listen(appconfig.PORT, () => {
  logger.application.info(`Application listening at :${appconfig.PORT}`);
});

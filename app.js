const PORT = process.env.PORT;
const path = require("path");
const express = require("express");
const favicon = require("serve-favicon");
const app =  express();

app.set("view engine", "ejs");

app.use(favicon(path.join(__dirname, "/public/favicon.ico")));
app.use("/public", express.static(path.join(__dirname, "/public")));
app.use("/", require("./routes/index.js"));

app.listen((PORT), ()=> {
  console.log(`Application listening at ${PORT}`);
});


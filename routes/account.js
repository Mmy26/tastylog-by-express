const router = require("express").Router();

router.use("/reviews", require("./account.reviews.js"));

module.exports = router;
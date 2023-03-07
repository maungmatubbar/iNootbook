const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  obj = {
    a: "Mong",
    b: 12,
  };
  return res.json(obj);
});
module.exports = router;

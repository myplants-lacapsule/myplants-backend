var express = require("express");
var router = express.Router();

require("../models/connection");
const Fact = require("../models/facts");

// Route pour afficher un fact aléatoirement
router.get("/", async (req, res) => {
  try {
    const randomFact = await Fact.find().select("-_id");

    const factsLength = randomFact.length;
    const number = Math.floor(Math.random() * factsLength);

    if (randomFact.length === 0 || factsLength < number) {
      return res.json({ result: false, error: "no facts found" });
    }

    res.json({ result: true, data: randomFact[number] });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});

module.exports = router;

var express = require("express");
var router = express.Router();

require("../models/connection");
const Fact = require("../models/facts");

router.get('/', async (req, res) => {
    try {

        const data = await Fact.find()

        const factsLength = data.length
        const number = Math.floor(Math.random() * factsLength)

        if (data.length === 0 || factsLength < number ) {
            return res.json({ result: false, error: "no facts found" })
        }
        
        res.json({ result: true, data: data[number] })

    } catch (error) {
        res.status(500).json({ result: false, error: error.message });
    }
})

module.exports = router;
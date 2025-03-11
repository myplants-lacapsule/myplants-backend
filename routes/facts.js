var express = require("express");
var router = express.Router();

require("../models/connection");
const Fact = require("../models/facts");

router.get('/', async (req, res) => {
    try {

        const data = await Fact.find().select("-_id").sort({lastDisplayed : +1}).limit(1)

        // console.log("data", data[0])

        // const factsLength = data.length
        // const number = Math.floor(Math.random() * factsLength)

        // if (data.length === 0 || factsLength < number ) {
        //     return res.json({ result: false, error: "no facts found" })
        // }
        
        res.json({ result: true, data: data[0] })

    } catch (error) {
        res.status(500).json({ result: false, error: error.message });
    }
})

module.exports = router;
var express = require("express");
var router = express.Router();

require("../models/connection");
const Item = require("../models/items");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");


// Route pour créer un item
router.post('/newItem/:userToken', (req, res) => {
 if (!checkBody(req.body, ["isGiven", "isPlant", "title", "description", "photo", "price", "height", "condition"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

    User.findOne({ token: req.params.userToken })
        .then(data => {
            if (!data) {
                return res.json({ result: false, error: 'User not found' });
            }else{
                const newItem = new Item({
                    isGiven: req.body.isGiven,
                    isPlant: req.body.isPlant,
                    title: req.body.title,
                    description: req.body.description,
                    photo: req.body.photo,
                    price: req.body.price,
                    height: req.body.height,
                    condition: req.body.condition,
                    token: uid2(32),
                    createdBy: data._id,
                    createdAt: Date.now(), 
                });
                newItem.save()
                res.json({ result: true });
                }
            }       
            )

});
        

module.exports = router;

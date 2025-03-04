var express = require("express");
var router = express.Router();

require("../models/connection");
const Item = require("../models/items");
const User = require("../models/users");
const uid2 = require("uid2");

const { checkBody } = require("../modules/checkBody");
const uniqid = require("uniqid");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;


// Route pour créer un item
router.post("/newItem/:userToken", async (req, res) => {

  // Envoyer le fichier sur Cloudinary

    const photoPath = `./tmp/${uniqid()}.jpg`;
    const resultMove = await req.files.photoFromFront.mv(photoPath);
    let photoUrl = "";

    if (!resultMove) {
        const resultCloudinary = await cloudinary.uploader.upload(photoPath);
        fs.unlinkSync(photoPath);
        photoUrl = resultCloudinary.secure_url;
    };

  User.findOne({ token: req.params.userToken })
    .then((userData) => {
      if (!userData) {
        return res.json({ result: false, error: "User not found" });
      }

          const newItem = new Item({
            isGiven: req.body.isGiven,
            isPlant: req.body.isPlant,
            title: req.body.title,
            description: req.body.description,
            photo: [photoUrl],
            price: Number(req.body.price),
            height: Number(req.body.height),
            condition: req.body.condition,
            token: uid2(32),
            createdBy: userData._id,
            createdAt: Date.now(),
          });

          newItem
            .save()
            .then((savedItem) => {
              res.json({ result: true, item: savedItem });
            })
            .catch((saveError) => {
              res.json({
                result: false,
                error: "Error saving item",
              });
            });
        })
    })
;

module.exports = router;

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
  }

  User.findOne({ token: req.params.userToken }).then((userData) => {
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
  });
});

// Route pour récupérer tous les items avec leur user associé
router.get("/allItems", async (req, res) => {
  try {
    const items = await Item.find().populate("createdBy", "token address -_id");
    res.json({ result: true, items });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});

// Route pour récupérer les items d'un utilisateur en particulier
router.get("/byUser/:userToken", async (req, res) => {
  try {
    const userToken = req.params.userToken;
    // Rechercher l'utilisateur à partir de son token
    const user = await User.findOne({ token: userToken });

    // Récupérer les items créés par cet utilisateur

    const items = await Item.find({ createdBy: user._id });

    res.json({ result: true, items });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});

module.exports = router;

var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["username", "email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ email: req.body.email }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        token: uid2(32),
        phone: req.body.phone,
        address: {
          street: req.body.street,
          city: req.body.city,
          postalCode: req.body.postalCode,
          country: req.body.country,
          long: req.body.long,
          lat: req.body.lat,
        }
      });

      newUser.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token, username: newDoc.username });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ email: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, username: data.username });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});


router.post("/getUserLocation", async (req, res) => {
  try {
   const token = req.body.token;
    if (!token) {
      return res.json({ result: false, error: "Token is required" });
    }

    const user = await User.findOne({ token });
    if (!user) {
      return res.json({ result: false, error: "User not found" });
    }

    // Supposons que l'adresse de l'utilisateur est stockée dans user.address.location
    res.json({
      result: true,
      latitude: user.address.location.lat || null,
      longitude: user.address.location.long || null,
    });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});

router.post("/updateLocation", async (req, res) => {
  try {
    const { token, street, city, postalCode } = req.body;
    if (!token || !street || !city || !postalCode) {
      return res.json({ result: false, error: "Missing required fields" });
    }

      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${address}&postcode=${postalCode}&limit=1`);
      if (!response.ok) {
        throw new Error("Erreur lors du géocodage");
      }
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].geometry.coordinates;
        return { latitude, longitude };
      }

    
    const user = await User.findOne({ token });
    if (!user) {
      return res.json({ result: false, error: "User not found" });
    }

    user.address = {
      street,
      city,
      postalCode,
      location: {
        lat: latitude,
        long: longitude,
      },
    };

    await user.save();
    res.json({ result: true });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});


module.exports = router;


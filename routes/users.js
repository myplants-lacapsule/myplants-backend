var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

// Route sign up
router.post("/signup", async (req, res) => {
  try {
    if (!checkBody(req.body, ["username", "email", "password"])) {
      return res.status(400).json({ result: false, error: "Missing or empty fields" });
    }
    // Vérification si le user n'est pas déjà enregistré
    const findUser = await User.findOne({ email: req.body.email });

    if (findUser === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        token: uid2(32),
        phone: req.body.phone,
        address: {
          street: null,
          city: null,
          postalCode: null,
          country: null,
          long: null,
          lat: null,
        },
      });

      const newDoc = await newUser.save(); // enregistrement du user

      // Renvoi au front du username et du token
      res.json({ result: true, token: newDoc.token, username: newDoc.username });
    } else {
      // Le user existe déjà
      res.json({ result: false, error: "User already exists" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});

// Route sign in
router.post("/signin", async (req, res) => {
  try {
    if (!checkBody(req.body, ["email", "password"])) {
      return res.status(400).json({ result: false, error: "Missing or empty fields" });
    }

    const findUser = await User.findOne({ email: req.body.email }); // recherche de l'email

    // Comparaison des passwords avec bcrypt
    if (findUser && (await bcrypt.compareSync(req.body.password, findUser.password))) {
      return res.json({ result: true, token: findUser.token, username: findUser.username });
    } else {
      return res.json({ result: false, error: "User not found or wrong password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: "Internal Server Error" });
  }
});

// Route pour avoir la localisation d'un user
router.get("/getUserLocation/:userToken", async (req, res) => {
  try {
    const userToken = req.params.userToken;

    const user = await User.findOne({ token: userToken }).select("address -_id");

    // Renvoie false si pas d'adresse
    if (!user || !user.address) {
      return res.json({ result: false, error: "User not found or address not available" });
    }

    // Renvoie de la localisation
    res.json({
      result: true,
      latitude: user.address.lat,
      longitude: user.address.long,
    });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});

// Update de la localisation
router.post("/updateLocation", async (req, res) => {
  try {
    const { token, street, city, postalCode } = req.body;
    if (!token || !street || !city || !postalCode) {
      return res.json({ result: false, error: "Missing required fields" });
    }

    // fetch à l'API gouv pour récupéréer la latitude/longitude
    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${street}&postcode=${postalCode}&limit=1`);
    if (!response.ok) {
      throw new Error("Erreur lors du géocodage");
    }
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      [longitude, latitude] = data.features[0].geometry.coordinates;
    }

    const user = await User.findOne({ token });
    if (!user) {
      return res.json({ result: false, error: "User not found" });
    }

    user.address = {
      street: street,
      city: city,
      postalCode: Number(postalCode),
      lat: latitude,
      long: longitude,
    };

    await user.save();

    res.json({ result: true });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
});

// Route log out non utilisée
// router.put('/logout/:userToken', async (req, res) => {
//   try {
//     const token = req.params.userToken

//     if (!token) {
//       return res.json({ result: false, error: "Token is required" })
//     }

//     const userFound = await User.findOne({ token: token })

//     const modifyToken = await User.updateOne({ _id: userFound._id }, { token: null })

//     if (modifyToken.modifiedCount === 1) {
//       res.json({ result: true, info: "token user deleted" })
//     } else {
//       res.json({ result: false })

//     }
//     // console.log("response ", response)
//   } catch (error) {
//     res.status(500).json({ result: false, error: error.message });
//   }
// })

module.exports = router;

var express = require("express");
var router = express.Router();
const ethers = require("ethers");
const { hashMessage } = require("@ethersproject/hash");
const jwt = require("jsonwebtoken");
const nacl = require("tweetnacl");
const bs58 = require("bs58");

var UserModel = require("../models/user");

const SECRET_KEY = "secret_key";

function generateAccessToken(user) {
  return jwt.sign(user, SECRET_KEY, { expiresIn: "18000s" });
}

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");

    const bearerToken = bearer[1];

    req.token = bearerToken;

    console.log(req.token);

    next();
  } else {
    res.json({
      err: 1,
      message: "Wrong",
    });
  }
};

/* GET home page. */
router.get("/", async function (req, res, next) {
  const publicKey = req.body.publicKey;
  const signature = req.body.signature;
  const signMessage = "sign";

  const retrievedAddress = ethers.utils.recoverAddress(
    hashMessage(signMessage),
    signature
  );

  let collection = await db.collection("posts");
  let results = await collection.find({}).limit(50).toArray();

  console.log("RES: ", results);

  if (retrievedAddress === publicKey) {
    res.json({
      err: 0,
      message: "Authorized",
    });
  } else {
    res.json({
      err: 1,
      message: "Wrong",
    });
  }
});

router.post("/sign-to-auth", async (req, res, next) => {
  const publicKey = req.body.publicKey;
  const signature = req.body.signature;
  const signMessage = "sign";

  const verified = nacl.sign.detached.verify(
    new TextEncoder().encode(signMessage),
    bs58.decode(signature),
    bs58.decode(publicKey)
  );

  if (verified) {
    console.log("verified!!");
    var foundUser = await UserModel.findOne({
      publicKey: publicKey,
    });

    if (foundUser) {
      console.log("user found: ", foundUser);
      res.json({
        err: 0,
        message: "Authorized",
        newUser: foundUser,
      });
    } else {
      var newUser = UserModel.create({
        publicKey: publicKey,
        avatar: "asd",
        name: "",
        mail: "",
        phone: "",
      });

      console.log(newUser);

      let a = (await newUser).save();

      res.json({
        err: 0,
        message: "Authorized",
        newUser: a,
      });
    }
  } else {
    res.json({
      err: 1,
      message: "Authentication failed",
    });
  }
});

router.post("/update-user", async (req, res, next) => {
  const publicKey = req.body.publicKey;
  const name = req.body.name;
  const mail = req.body.mail;
  const phone = req.body.phone;
  const update = { name: name, mail: mail, phone: phone };

  await UserModel.findOneAndUpdate(
    {
      publicKey: publicKey,
    },
    update
  );

  res.json({
    err: 0,
    message: "Authorized",
    newUser: {
      publicKey: publicKey,
      avatar: "asd",
      name: name,
      mail: mail,
      phone: phone,
    },
  });
});

router.post("/user-auth", async (req, res, next) => {
  const publicKey = req.body.publicKey;
  const signature = req.body.signature;
  const signMessage = "sign";

  const verified = nacl.sign.detached.verify(
    new TextEncoder().encode(signMessage),
    bs58.decode(signature),
    bs58.decode(publicKey)
  );

  if (verified) {
    var foundUser = await UserModel.findOne({
      publicKey: publicKey,
    });

    const token = generateAccessToken({ foundUser });

    res.json({
      err: 0,
      message: "Authorized",
      newUser: foundUser,
      token: token,
    });
  } else {
    res.json({
      err: 1,
      message: "Authentication failed",
    });
  }
});

router.get("/user-jwt-verify", verifyToken, async (req, res, next) => {
  jwt.verify(req.token, SECRET_KEY, (err, authData) => {
    if (err) {
      res.json({
        error: 1,
        message: "Something is wrong",
      });
    } else {
      res.json({
        message: "Succesfull",
        authData: authData,
        error: 0,
      });
    }
  });
});

/// Add normal application authentication
/// Return JWT Token
/// Let user application check with that JWT Token
/// Build programs
/// Add social recovery

/// Add mongo db register users

module.exports = router;

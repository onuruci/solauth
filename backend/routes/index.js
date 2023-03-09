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
  console.log("what the fuck is going on");
  const bearerHeader = req.headers["authorization"];
  console.log("hello wolegçkkjrehgjrkeg");
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
    let newUser = UserModel.create({
      publicKey: publicKey,
      avatar: "temp-avatar",
      name: req.body.name,
      mail: req.body.mail,
      phone: req.body.phone,
    });

    let response = (await newUser).save();

    res.json({
      err: 0,
      message: "Authorized",
      newUser: response,
    });
  } else {
    res.json({
      err: 1,
      message: "User cannot be verified",
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
  console.log("welcome to the world");
  jwt.verify(req.token, SECRET_KEY, (err, authData) => {
    console.log("auth data: ", authData);
    if (err) {
      console.error(err);
      res.json({
        error: 1,
        message: "JWT is expired",
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

//check if user exists
router.get("/:publicKey", async (req, res, next) => {
  const publicKey = req.params["publicKey"];
  const user = await UserModel.findOne({
    publicKey: publicKey,
  });
  if (user) {
    res.json({
      isExist: true,
      user: user,
    });
  } else {
    res.json({
      isExist: false,
    });
  }
});

/// Add normal application authentication
/// Return JWT Token
/// Let user application check with that JWT Token
/// Build programs
/// Add social recovery

/// Add mongo db register users

module.exports = router;

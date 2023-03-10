var express = require("express");
var router = express.Router();
const ethers = require("ethers");
const { hashMessage } = require("@ethersproject/hash");
const jwt = require("jsonwebtoken");
const nacl = require("tweetnacl");
const bs58 = require("bs58");
const multer = require("multer");
const dotenv = require("dotenv");
const crypto = require("crypto");
const sharp = require("sharp");
var UserModel = require("../models/user");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

dotenv.config();

const BUCKET_NAME = process.env.BUCKET_NAME;
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const SECRET_KEY = "secret_key";

const s3 = new S3Client({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  region: AWS_BUCKET_REGION,
});

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

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

router.get("image/:id", async (req, res, next) => {
  const publicKey = req.params["id"];

  const user = UserModel.findOne({
    publicKey: publicKey,
  });

  if (user) {
    const getObjectParams = {
      Bucket: BUCKET_NAME,
      key: user.imageName,
    };

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    console.log(url);
  }
});

router.post("/send-image", upload.single("image"), async (req, res, next) => {
  const file = req.file;

  const buffer = await sharp(req.file.buffer)
    .resize({
      height: 1920,
      width: 1080,
      fit: "contain",
    })
    .toBuffer();

  const params = {
    Bucket: BUCKET_NAME,
    Key: randomImageName(),
    Body: buffer,
    ContentType: req.file.mimetype,
  };

  const command = new PutObjectCommand(params);

  const response = await s3.send(command);
  console.log(response);
});

router.post(
  "/sign-to-auth",
  upload.single("profile_image"),
  async (req, res, next) => {
    console.log(req.body);
    const publicKey = req.body.publicKey;
    const signature = req.body.signature;
    const signMessage = "sign";

    const verified = nacl.sign.detached.verify(
      new TextEncoder().encode(signMessage),
      bs58.decode(signature),
      bs58.decode(publicKey)
    );

    if (verified) {
      const buffer = await sharp(req.file.buffer)
        .resize({
          height: 1920,
          width: 1080,
          fit: "cover",
        })
        .toBuffer();

      const imageName = randomImageName();
      const params = {
        Bucket: BUCKET_NAME,
        Key: imageName,
        Body: buffer,
        ContentType: req.file.mimetype,
      };

      const command = new PutObjectCommand(params);

      const awsResponse = await s3.send(command);
      console.log(awsResponse);

      let newUser = UserModel.create({
        publicKey: publicKey,
        avatar: imageName,
        name: req.body.name,
        mail: req.body.mail,
        phone: req.body.phone,
      });

      let saveResponse = (await newUser).save();

      res.json({
        err: 0,
        message: "Authorized",
        newUser: newUser,
      });
    } else {
      res.json({
        err: 1,
        message: "User cannot be verified",
      });
    }
  }
);

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
router.get("/user/:publicKey", async (req, res, next) => {
  const publicKey = req.params["publicKey"];
  const user = await UserModel.findOne({
    publicKey: publicKey,
  });
  if (user) {
    const params = {
      Bucket: BUCKET_NAME,
      Key: user.avatar,
    };

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: 60 });
    let userToSend = user;
    userToSend.imageUrl = url;
    console.log(userToSend);
    res.json({
      isExist: true,
      user: {
        ...user,
        imageUrl: url,
      },
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

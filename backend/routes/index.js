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
  res.json({
    err: 0,
    message: "Authorized",
  });
});

/// Image functionality is there a need for authentication ??

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

/// User profile generate on our platform

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

/// User profile update
/// Check user signature or JWT

router.post(
  "/update-user",
  verifyToken,
  upload.single("profile_image"),
  async (req, res, next) => {
    const publicKey = req.body.publicKey;
    const name = req.body.name;
    const mail = req.body.mail;
    const phone = req.body.phone;

    console.log("NAME:  ", req.body.name);

    jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
      if (!err) {
        const user = await UserModel.findOne({
          publicKey: publicKey,
        });

        if (user) {
          const imageName = user.avatar;

          if (req.file) {
            const buffer = await sharp(req.file.buffer)
              .resize({
                height: 1920,
                width: 1080,
                fit: "contain",
              })
              .toBuffer();
            const params = {
              Bucket: BUCKET_NAME,
              Key: imageName,
              Body: buffer,
              ContentType: req.file.mimetype,
            };

            const command = new PutObjectCommand(params);

            const awsResponse = await s3.send(command);
            console.log(awsResponse);
          }

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
              avatar: imageName,
              name: name,
              mail: mail,
              phone: phone,
            },
          });
        } else {
          res.json({
            err: 1,
            message: "User cannot be found",
          });
        }
      } else {
        res.json({
          error: 1,
          message: "JWT is expired",
        });
      }
    });
  }
);

/// Endpoint for applcations to use and sign-in users
/// Checks signature signs-in the user with returning a JWT Token
/// This JWT Token will later be used for authenticating thus no more need for signature

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
    var user = await UserModel.findOne({
      publicKey: publicKey,
    });

    if (user) {
      const params = {
        Bucket: BUCKET_NAME,
        Key: user.avatar,
      };

      const token = generateAccessToken({ user });

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
        token: token,
      });
    } else {
      res.json({
        err: 1,
        message: "User not found",
      });
    }
  } else {
    res.json({
      err: 1,
      message: "Authentication failed",
    });
  }
});

/// This enpoint is for applciations to reach and keeps users signed-in with verifying their tokens
/// Without making them sign everything

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

// check if user exists
// First JWT should be verified

router.post("/user", verifyToken, async (req, res, next) => {
  jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
    if (!err) {
      const publicKey = req.body.publicKey;
      const user = await UserModel.findOne({
        publicKey: publicKey,
      });

      console.log("USER: ");
      if (user) {
        console.log("USER FOUND");
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
    } else {
      console.log("ERR");
      res.json({
        err: 1,
        message: "Authentication failed",
      });
    }
  });
});

router.post("/check-user", async (req, res, next) => {
  const publicKey = req.body.publicKey;
  const user = await UserModel.findOne({
    publicKey: publicKey,
  });

  console.log(publicKey);

  if (user) {
    res.json({
      isExist: true,
    });
  } else {
    res.json({
      isExist: false,
    });
  }
});

// Add required functionality for authentication

// Get signature message from the platform, thus they can generate customized messages

module.exports = router;

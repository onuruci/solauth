var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    publicKey: { type: String, required: true, unique: true },
    avatar: { type: String },
    name: { type: String },
    mail: { type: String },
    phone: { type: String },
    birthday: { type: Date },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  const saltRounds = 10;
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, saltRounds, (err, hash) => {
    this.password = hash;
    next();
  });
});

UserSchema.methods.validatePassword = function (newPassword) {
  return bcrypt.compareSync(newPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);

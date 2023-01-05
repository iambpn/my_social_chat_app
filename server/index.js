require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserModel = require("./models/user");
const { ZodError } = require("zod");
const { registerBodySchema } = require("./validation_schema/register.schema");
const { formatZodError } = require("./helper/formatZodError");
const { loginSchema } = require("./validation_schema/login.schema");

const app = express();
mongoose.connect(process.env.mongo_url);

app.use(express.json());

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      throw new Error("User or password did not matched");
    }

    if (!user.validatePassword(password)) {
      throw new Error("User or password did not matched");
    }

    return res.status(200).json({
      userInfo: {
        ...user.toObject(),
        password: undefined,
      },
    });
  } catch (error) {
    console.log(error);

    let messages = [error?.message];
    if (error instanceof ZodError) {
      messages = formatZodError(error);
    }

    return res.status(400).json({
      messages,
    });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password, re_password } = registerBodySchema.parse(req.body);

    const userData = await UserModel.findOne({ email: email });
    if (userData) {
      throw new Error("Email already in use. Please user another email.");
    }

    if (password !== re_password) {
      throw new Error("Password did not matched");
    }

    const user = new UserModel({
      email,
      username,
      password,
    });
    await user.save();
    res.status(201).json({
      message: "Created",
    });
  } catch (error) {
    console.log(error);

    let messages = [error?.message];
    if (error instanceof ZodError) {
      messages = formatZodError(error);
    }

    return res.status(400).json({
      messages: messages,
    });
  }
});

app.post("/api/messages", (req, res) => {});

app.post("/api/conversations", (req, res) => {});

app.listen(3000, () => {
  console.log("listening on port 3000");
});

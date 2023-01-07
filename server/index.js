require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const UserModel = require("./models/user");
const MessageModel = require("./models/message");
const ConversationModel = require("./models/conversation");
const { ZodError } = require("zod");
const { registerBodySchema } = require("./validation_schema/register.schema");
const { formatZodError } = require("./helper/formatZodError");
const { loginSchema } = require("./validation_schema/login.schema");
const { MessageParamsSchema, MessageQuerySchema } = require("./validation_schema/messages.schema");
const { ConversationQuerySchema } = require("./validation_schema/conversation.schema");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { RequireAuth } = require("./helper/RequireAuth.middleware");
const { json } = require("express");

const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    name: "sse_chat_app",
    rolling: true,
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: Number(process.env.SESSION_MAX_AGE ?? 86400000), // default 1 day
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
  })
);
mongoose.connect(process.env.MONGO_URL);

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

    const userInfo = {
      ...user.toObject(),
      password: undefined,
    };

    req.session.user = userInfo;

    return res.status(200).json({
      userInfo,
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

app.get("/api/auth/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(400).json({ message: "There was a problem logging out." });
    }
    res.json({ message: "Logout Successful" });
  });
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

app.get("/api/user", RequireAuth, (req, res) => {
  return res.status(200).json({
    data: req.session.user,
  });
});

app.get("/api/messages/:conversation_id", RequireAuth, async (req, res) => {
  try {
    const { conversation_id } = MessageParamsSchema.parse(req.params);
    const query = MessageQuerySchema.parse(req.query);
    const messages = await MessageModel.find({
      conversationId: conversation_id,
    })
      .limit(query.take ?? 20)
      .skip((query.page ?? 1) * query.take ?? 20)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      data: messages,
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

app.get("/api/conversations", RequireAuth, async (req, res) => {
  try {
    const query = ConversationQuerySchema.parse(req.query);
    const conversations = await ConversationModel.find({
      members: { $in: [req.session.user.id] },
    })
      .limit(query.take ?? 5)
      .skip((query.page ?? 1) * query.take ?? 5)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      data: conversations,
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

app.listen(3000, () => {
  console.log("listening on port 3000");
});

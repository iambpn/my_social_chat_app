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
const { MessageParamsSchema, MessageQuerySchema, SendMessageSchema } = require("./validation_schema/messages.schema");
const { ConversationQuerySchema, CreateConversationSchema } = require("./validation_schema/conversation.schema");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { RequireAuth, BlockAuth } = require("./helper/Auth.middleware");
const cors = require("cors");
const helmet = require("helmet");

const responseMapper = new Map();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:8080"],
    credentials: true,
  })
);
app.use(helmet());
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

app.post("/api/auth/login", BlockAuth, async (req, res) => {
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

app.post("/api/auth/register", BlockAuth, async (req, res) => {
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

app.get("/api/friends", RequireAuth, async (req, res) => {
  try {
    const query = MessageQuerySchema.parse(req.query);
    const messages = await UserModel.find({
      _id: { $ne: req.session.user._id },
    })
      .limit(query.take ?? 20)
      .skip((query.page ?? 1) * query.take ?? 20)
      .select({ password: 0, email: 0 });

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

app.get("/api/messages/:conversation_id", RequireAuth, async (req, res) => {
  try {
    const { conversation_id } = MessageParamsSchema.parse(req.params);
    const query = MessageQuerySchema.parse(req.query);
    const messages = await MessageModel.find({
      conversationId: conversation_id,
    })
      .limit(query.take ?? 20)
      .skip((query.page ?? 1) * query.take ?? 20)
      .sort({ createdAt: -1 })
      .populate("conversationId")
      .populate("sender", { password: 0, email: 0 });

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
      members: { $in: [req.session.user._id] },
    })
      .limit(query.take ?? 5)
      .skip((query.page ?? 1) * query.take ?? 5)
      .sort({ createdAt: -1 })
      .populate("members", { password: 0, email: 0 });

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

app.post("/api/conversation", RequireAuth, async (req, res) => {
  try {
    const { users } = CreateConversationSchema.parse(req.body);

    await Promise.all(
      users.map(async (user_id) => {
        const user = await UserModel.findOne({
          _id: new mongoose.Types.ObjectId(user_id),
        });

        if (!user) {
          throw new Error("User Not found");
        }
        return user;
      })
    );

    const conversation = new ConversationModel({
      members: users,
    });
    await conversation.save();

    return res.status(201).json({
      message: "Created",
      message: "Created",
    });
  } catch (error) {
    console.log(error);

    let messages = [error.message];
    if (error instanceof ZodError) {
      messages = formatZodError(error);
    }
    return res.status(400).json({
      messages,
    });
  }
});

app.get("/api/notify/messages", RequireAuth, async (req, res) => {
  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // client side connection close
    res.on("close", () => {
      responseMapper.delete(req.session.user._id);
      console.log("Connection closed by client");
      res.end();
    });

    const res_key = `${req.session.user._id}`;
    let savedResponse = responseMapper.get(res_key);
    if (!savedResponse) {
      responseMapper.set(res_key, res);
      savedResponse = responseMapper.get(res_key);
    }

    savedResponse.write("event: statusCheck\n");
    savedResponse.write(`data: ${JSON.stringify({ status: "Connected" })}\n\n`);
  } catch (error) {
    console.log(error);

    res.removeHeader("Content-Type");
    res.removeHeader("Connection");

    let messages = [error.message];
    if (error instanceof ZodError) {
      messages = formatZodError(error);
    }
    return res.status(400).json({
      messages,
    });
  }
});

app.post("/api/message/:conversation_id", RequireAuth, async (req, res) => {
  try {
    const { conversation_id } = MessageParamsSchema.parse(req.params);
    const body = SendMessageSchema.parse(req.body);

    const conversation = await ConversationModel.findOne({
      _id: conversation_id,
    });

    if (!conversation) {
      return res.status(400).json({
        message: "Conversation id not found",
      });
    }

    let message = new MessageModel({
      conversationId: conversation_id,
      sender: req.session.user._id,
      text: body.message,
    });
    message = await message.save();

    message = await MessageModel.findOne({
      _id: message._id,
    })
      .populate("conversationId")
      .populate("sender", { password: 0, email: 0 });

    // notify users of conversation_id
    conversation.members.forEach((user_id) => {
      const savedResponse = responseMapper.get(`${user_id}`);
      if (savedResponse && user_id.toString() !== req.session.user._id) {
        savedResponse.write("event: newMessage\n");
        savedResponse.write(`data: ${JSON.stringify({ message })}\n\n`);
      }
    });

    return res.status(200).json({
      message: "message sent",
    });
  } catch (error) {
    console.log(error);

    let messages = [error.message];
    if (error instanceof ZodError) {
      messages = formatZodError(error);
    }
    return res.status(400).json({
      messages,
    });
  }
});

app.get("/api/sse_users", RequireAuth, (req, res) => {
  return res.status(200).json({
    users: Array.from(responseMapper.keys()),
  });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});

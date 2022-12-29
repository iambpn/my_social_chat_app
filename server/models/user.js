const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema();
// fill up the schema

module.exports = mongoose.model("Message", MessageSchema);

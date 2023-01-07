const { z } = require("zod");
const { paginationSchema } = require("./common.schema");

const ConversationQuerySchema = z.object({});

module.exports = {
  ConversationQuerySchema: ConversationQuerySchema.merge(paginationSchema.partial()),
};

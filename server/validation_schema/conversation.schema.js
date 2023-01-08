const { z } = require("zod");
const { paginationSchema } = require("./common.schema");

const ConversationQuerySchema = z.object({});

const CreateConversationSchema = z.object({
  users: z.array(z.string()).min(2),
});

module.exports = {
  ConversationQuerySchema: ConversationQuerySchema.merge(paginationSchema.partial()),
  CreateConversationSchema,
};

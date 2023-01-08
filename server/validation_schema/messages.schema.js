const { z } = require("zod");
const { paginationSchema } = require("./common.schema");

const MessageParamsSchema = z.object({
  conversation_id: z.string(),
});

const MessageQuerySchema = z.object({});

const SendMessageSchema = z.object({
  message: z.string().min(2),
});

module.exports = {
  MessageParamsSchema,
  MessageQuerySchema: MessageQuerySchema.merge(paginationSchema.partial()),
  SendMessageSchema,
};

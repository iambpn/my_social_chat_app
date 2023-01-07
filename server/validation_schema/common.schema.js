const { z } = require("zod");

const paginationSchema = z.object({
  page: z.coerce.number(),
  take: z.coerce.number(),
});

module.exports = {
  paginationSchema,
};

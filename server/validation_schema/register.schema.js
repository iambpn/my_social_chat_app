const z = require("zod");

const registerBodySchema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  re_password: z.string().min(8),
});

module.exports = {
  registerBodySchema,
};

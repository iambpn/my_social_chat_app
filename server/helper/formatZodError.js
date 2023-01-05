const { fromZodError } = require("zod-validation-error");

function formatZodError(error) {
  const validationError = fromZodError(error);
  console.log(validationError.message);
  const message = validationError.message.split(":").slice(1).join(":");
  return message.split(";");
}

module.exports = {
  formatZodError,
};

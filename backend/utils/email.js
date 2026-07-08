const normalizeEmail = (value = "") => (value || "").trim().toLowerCase();

const buildCaseInsensitiveEmailFilter = (email) => ({
  email: {
    equals: normalizeEmail(email),
    mode: "insensitive",
  },
});

module.exports = {
  normalizeEmail,
  buildCaseInsensitiveEmailFilter,
};

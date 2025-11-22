// Very basic HTML escape to prevent XSS
module.exports = function sanitize(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

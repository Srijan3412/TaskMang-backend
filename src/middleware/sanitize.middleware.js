import xss from "xss";

/**
 * Recursively sanitize all string values in an object to prevent XSS.
 * Strips HTML/script tags from user-controlled input before it reaches
 * controllers/services.
 */
const sanitizeValue = (value) => {
  if (typeof value === "string") {
    return xss(value);
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === "object") {
    return sanitizeObject(value);
  }
  return value;
};

const sanitizeObject = (obj) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeValue(value);
  }
  return sanitized;
};

/**
 * Express middleware that sanitizes req.body, req.query, and req.params
 * against XSS injection before any controller logic runs.
 */
const sanitizeMiddleware = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === "object") {
    req.query = sanitizeObject(req.query);
  }
  if (req.params && typeof req.params === "object") {
    req.params = sanitizeObject(req.params);
  }
  next();
};

export default sanitizeMiddleware;

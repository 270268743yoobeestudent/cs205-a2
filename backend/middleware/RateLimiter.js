const rateLimit = require("express-rate-limit");

// Rate Limiting Middleware
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  handler: (req, res) => {
    // Log the IP that is being rate-limited
    console.warn(`Rate limit exceeded: ${req.ip}`);

    // Respond with a custom message and status code 429 (Too Many Requests)
    res.status(429).json({
      success: false,
      message: "Too many requests from your IP, please try again later.",
    });
  },
});

module.exports = rateLimiter;

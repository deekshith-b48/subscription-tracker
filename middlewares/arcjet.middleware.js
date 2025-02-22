import aj from '../config/arcjet.js'; // Import the Arcjet client

// Middleware function
const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 5 }); // Deduct 5 tokens from the bucket
    console.log("Arcjet decision", decision);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ error: "No bots allowed" });
      } else {
        return res.status(403).json({ error: "Forbidden" });
      }
    } else if (decision.results.some(isSpoofed)) {
      // Arcjet Pro plan verifies the authenticity of common bots using IP data.
      // Verification isn't always possible, so we recommend checking the decision
      // separately.
      // https://docs.arcjet.com/bot-protection/reference#bot-verification
      return res.status(403).json({ error: "Forbidden" });
    } else {
      next(); // Continue to the next middleware or route handler
    }
  } catch (error) {
    console.error('Unexpected error in arcjetMiddleware:', error);
    next(error); // Pass the unexpected error to Express
  }
};

// Helper function to check for spoofed requests
function isSpoofed(result) {
  return (
    result.state !== "DRY_RUN" &&
    result.reason.isBot() &&
    result.reason.isSpoofed()
  );
}

export default arcjetMiddleware; // Export the middleware
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token; // Get token from cookies

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    // Verify JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Attach user info to request object
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid or Expired Token" });
  }
};

export default authMiddleware;

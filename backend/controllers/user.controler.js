import axios from "axios";
import jwt from "jsonwebtoken";

import oAuth2Client from "../lib/googleConfing.js";
import User from "../models/user.model.js";

export const googleLogin = async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  try {
    const { code } = req.query;
    if (!code)
      return res
        .status(400)
        .json({ success: false, message: "Missing auth code" });

    // ✅ Exchange Auth Code for Access Token
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // ✅ Fetch User Info from Google API
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );

    const { email, name, picture } = userRes.data;

    // ✅ Find or Create User
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, username: name, avatar: picture });
      await user.save();
    }

    // ✅ Generate JWT Token
    const { _id, role } = user;
    const token = jwt.sign(
      { _id, role, email, username: name, avatar: picture },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ✅ Store Token in HTTP-Only Cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Send Success Response
    return res
      .status(200)
      .json({ success: true, message: "Login successful", user });
  } catch (error) {
    console.error("Google Login Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = req.user;
    if (!user)
      return res.json({ success: false, message: "No user logged in" });
    return res.json({ success: true, message: "User logged in", user });
  } catch (error) {
    console.error("Check Auth Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear only your application's token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    // Send success response
    return res
      .status(200)
      .json({
        success: true,
        message: "Successfully logged out from application",
      });
  } catch (error) {
    console.error("Logout Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

import jwt from "jsonwebtoken";
import { googleClient } from "../config/google.js";
import { User } from "../models/User.js";

const signToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

export const googleAuth = async (req, res) => {
  try {
    const { idToken, pushToken, phoneNumber } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "idToken is required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        pushToken: pushToken ?? "",
        phoneNumber: phoneNumber ?? ""
      });
    } else {
      user.name = payload.name ?? user.name;
      user.picture = payload.picture ?? user.picture;
      if (pushToken) user.pushToken = pushToken;
      if (phoneNumber) user.phoneNumber = phoneNumber;
      await user.save();
    }

    const token = signToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Google authentication failed", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { phoneNumber, pushToken } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (pushToken !== undefined) user.pushToken = pushToken;

    await user.save();

    return res.status(200).json({
      message: "Profile updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

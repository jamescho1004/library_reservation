import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
const router = Router();

router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/register", async (req, res) => {
  try {
    const { userId, password, name, phone } = req.body;

    if (!userId || !password || !name || !phone)
      return res.status(400).json({ error: "Please fill in all fields" });

    const existingUser = await User.findOne({ userId });
    if (existingUser)
      return res.status(400).json({
        field: "userId",
        error: "This ID is already in use",
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      userId,
      password: hashedPassword,
      name,
      phone,
    });

    await user.save();

    return res.status(201).json({
      message: "Registration successful",
    });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password)
      return res.status(400).json({ error: "Please fill in all fields" });

    const user = await User.findOne({ userId });
    if (!user)
      return res.status(400).json({
        field: "userId",
        error: "This ID does not exist",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        field: "password",
        error: "Incorrect password",
      });

    req.session.user = {
      id: user._id,
      userId: user.userId,
      name: user.name,
      phone: user.phone,
    };

    return res.status(201).json({
      message: "Login successful",
    });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }

    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logout successful" });
  });
});

export default router;

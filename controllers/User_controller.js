const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.signup = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    let user = await User.findOne({ username });
    if (user) {
      return res.status(401).json({
        success: false,
        message: "User already exists!",
      });
    }

    user = await User.create({ name, username, password });

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.follow = async (req, res) => {
  try {
    const { iden } = req.body;

    const follower = await User.findById(req.user.userId);
    const followingUser = await User.findById(iden);

    if (!follower || !followingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    follower.followers.push(followingUser.userId);
    followingUser.following.push(follower.userId);

    await follower.save();
    await followingUser.save();

    res.status(201).json({
      success: true,
      message: `${follower.username} is following ${followingUser.username}`,
    });
  } catch (error) {
    console.error("Error following user:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

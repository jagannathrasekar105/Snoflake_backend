const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
    findUserByEmail,
    createUser,
    findUserById,
    updateProfilePic,
    deleteProfilePic,
} = require("../models/userModel");

const JWT_SECRET = "your_secret_key"; // Replace with environment variable in production

// Register
exports.register = async (req, res) => {
    const { email, firstName, lastName, username, password } = req.body;

    if (!email || !firstName || !lastName || !username || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { email, firstName, lastName, username, password: hashedPassword };

        await createUser(newUser);
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: "Email and password are required" });

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.PASSWORD);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.ID, email: user.EMAIL }, JWT_SECRET, {
            expiresIn: "1d",
        });

        res.json({ message: "Login successful", token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
};

// Update profile picture
exports.updateProfilePic = async (req, res) => {
    const userId = req.params.id;
    const { profilePic } = req.body;

    if (!profilePic) return res.status(400).json({ error: "profilePic is required" });

    try {
        await updateProfilePic(userId, profilePic);
        res.status(200).json({ message: "Profile picture updated" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update profile picture" });
    }
};

// Delete profile picture
exports.deleteProfilePic = async (req, res) => {
    const userId = req.params.id;

    try {
        await deleteProfilePic(userId);
        res.status(200).json({ message: "Profile picture deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete profile picture" });
    }
};

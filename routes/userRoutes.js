const express = require('express');
const router = express.Router();
const multer = require("multer");
const jwt = require('jsonwebtoken');
const upload = multer();
const {
    register,
    login,
    getUserById,
    updateProfilePic,
    deleteProfilePic,
    authentication
} = require('../controllers/userController');
const authenticateJWT = require('../middlewares/authenticateJWT');
// User Registration
router.post('/register', register);

// User Login
router.post('/login', login);

// Get User by ID
router.get('/:id', getUserById);

// Update Profile Picture (POST method)
router.post('/:id/upload-profile-pic', upload.single("profilePic"), updateProfilePic);

// Delete Profile Picture (POST method)
router.delete('/:id/remove-profile-pic', deleteProfilePic);

router.get('/authenticate/me', authentication);
// In your routes/auth.js or similar file
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true in production
        sameSite: 'strict',
    });
    res.json({ message: 'Logged out successfully coockie' });
});

module.exports = router;

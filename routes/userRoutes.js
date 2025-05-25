const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer();
const {
    register,
    login,
    getUserById,
    updateProfilePic,
    deleteProfilePic
} = require('../controllers/userController');
const authenticateJWT = require('../middlewares/authenticateJWT');
// User Registration
router.post('/register', register);

// User Login
router.post('/login', login);

// Get User by ID
router.get('/:id', getUserById);

// Update Profile Picture (POST method)
router.post('/:id/profile-pic', authenticateJWT, upload.single("profilePic"), updateProfilePic);

// Delete Profile Picture (POST method)
router.delete('/:id/delete-profile-pic', authenticateJWT, deleteProfilePic);

module.exports = router;

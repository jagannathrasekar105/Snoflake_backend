const db = require("../config/db");

const executeQuery = (sqlText, binds = []) => {
    return new Promise((resolve, reject) => {
        db.execute({
            sqlText,
            binds,
            complete: function (err, stmt, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            },
        });
    });
};

// Find user by email
const findUserByEmail = async (email) => {
    const results = await executeQuery("SELECT * FROM users WHERE email = ?", [email]);
    return results[0] || null;
};

// Create a new user
const createUser = async (userData) => {
    const { firstName, lastName, email, username, password } = userData;
    await executeQuery(
        "INSERT INTO users (FIRSTNAME, LASTNAME, EMAIL, USERNAME, PASSWORD, PROFILEPIC) VALUES (?, ?, ?, ?, ?, ?)",
        [firstName, lastName, email, username, password, null]
    );
};

// Update profile picture
const updateProfilePic = async (userId, profilePic) => {
    await executeQuery("UPDATE users SET PROFILEPIC = ? WHERE ID = ?", [profilePic, userId]);
};

// Find user by ID
const findUserById = async (id) => {
    const results = await executeQuery("SELECT ID, FIRSTNAME, LASTNAME, EMAIL, USERNAME,PROFILEPIC,CREATED_AT FROM users WHERE ID = ?",
        [id]);
    return results[0] || null;
};

// Delete profile picture
const deleteProfilePic = async (userId) => {
    await executeQuery("UPDATE users SET PROFILEPIC = NULL WHERE ID = ?", [userId]);
};

module.exports = {
    findUserByEmail,
    createUser,
    updateProfilePic,
    findUserById,
    deleteProfilePic,
};

const connection = require("../config/db");
const executeQuery = (sqlText, binds = []) => {
    return new Promise((resolve, reject) => {
        connection.execute({
            sqlText,
            binds,
            complete: (err, stmt, rows) => {
                if (err) {
                    console.error("SQL Error:", err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            },
        });
    });
};

exports.addToWishlist = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const checkSql = `
      SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?
    `;
        const existing = await executeQuery(checkSql, [userId, productId]);

        if (existing.length > 0) {
            return res.json({ success: false, message: "Already in wishlist" });
        }

        const insertSql = `
      INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)
    `;
        await executeQuery(insertSql, [userId, productId]);

        res.json({ success: true, message: "Added to wishlist" });
    } catch (err) {
        console.error("Error adding to wishlist:", err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getWishlist = async (req, res) => {
    const { userId } = req.params;

    try {
        const sql = `
      SELECT p.*
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
    `;
        const result = await executeQuery(sql, [userId]);
        res.json(result);
    } catch (err) {
        console.error("Error fetching wishlist:", err);
        res.status(500).json({ error: "Failed to fetch" });
    }
};

exports.removeFromWishlist = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const sql = `
      DELETE FROM wishlist WHERE user_id = ? AND product_id = ?
    `;
        await executeQuery(sql, [userId, productId]);
        res.json({ success: true, message: "Removed from wishlist" });
    } catch (err) {
        console.error("Error removing from wishlist:", err);
        res.status(500).json({ error: "Failed to remove" });
    }
};

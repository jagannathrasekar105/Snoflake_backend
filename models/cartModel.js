const db = require("../config/db");

const executeQuery = (sqlText, binds = []) => {
    return new Promise((resolve, reject) => {
        db.execute({
            sqlText,
            binds,
            complete: (err, stmt, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            },
        });
    });
};

const addToCart = async (userId, productId, quantity) => {
    // Check if the item is already in the cart
    const checkQuery = `SELECT * FROM cart_items WHERE USER_ID = ? AND PRODUCT_ID = ?`;
    const existingItems = await executeQuery(checkQuery, [userId, productId]);

    if (existingItems.length > 0) {
        // Item exists: update quantity
        const newQuantity = existingItems[0].QUANTITY + quantity;
        const updateQuery = `
      UPDATE cart_items SET QUANTITY = ? WHERE USER_ID = ? AND PRODUCT_ID = ?
    `;
        await executeQuery(updateQuery, [newQuantity, userId, productId]);
        return { message: "Cart updated", updated: true };
    } else {
        // Item doesn't exist: insert new
        const insertQuery = `
      INSERT INTO cart_items (USER_ID, PRODUCT_ID, QUANTITY, ADDED_AT)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `;
        await executeQuery(insertQuery, [userId, productId, quantity]);
        return { message: "Item added to cart", updated: false };
    }
};

const updateCartItem = async (userId, productId, quantity) => {
    const query = `
    UPDATE cart_items 
    SET QUANTITY = ? 
    WHERE USER_ID = ? AND PRODUCT_ID = ?
  `;
    const result = await executeQuery(query, [quantity, userId, productId]);
    return { message: "Quantity updated", result };
};
const getCartItems = async (userId) => {
    const query = `
      SELECT c.id AS cartItemId, c.quantity, p.*
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `;
    const result = await executeQuery(query, [userId]);
    return result;
};
const removeCartItem = async (userId, productId) => {
    const query = `DELETE FROM cart_items WHERE user_id = ? AND product_id = ?`;
    const result = await executeQuery(query, [userId, productId]);
    return { message: "Item removed from cart", result };
};


module.exports = {
    addToCart,
    updateCartItem,
    getCartItems,
    removeCartItem
};

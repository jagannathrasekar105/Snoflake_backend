const db = require("../config/db");


const { v4: uuidv4 } = require("uuid");

exports.saveOrder = (req, res) => {
    const {

        name,
        mobile,
        address,
        city,
        pincode,
        payment_method,
        total_amount,
        items,
    } = req.body;
    const user_id = req.user.id;
    if (
        !user_id ||
        !name ||
        !mobile ||
        !address ||
        !city ||
        !pincode ||
        !payment_method ||
        !total_amount ||
        !Array.isArray(items) ||
        items.length === 0
    ) {
        return res.status(400).json({ error: "Missing required fields or empty items" });
    }

    const orderId = uuidv4(); // manually generate UUID

    const orderInsertSQL = `
    INSERT INTO orders 
    (id, user_id, name, mobile, address, city, pincode, payment_method, total_amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    db.execute({
        sqlText: orderInsertSQL,
        binds: [
            orderId,
            user_id,
            name,
            mobile,
            address,
            city,
            pincode,
            payment_method,
            total_amount,
        ],
        complete: (err) => {
            if (err) {
                console.error("Error inserting order:", err);
                return res.status(500).json({ error: "Failed to insert order" });
            }

            // Insert each order item recursively
            const insertItem = (index) => {
                if (index >= items.length) {
                    return res.json({ message: "Order placed successfully", order_id: orderId });
                }

                const item = items[index];

                const itemInsertSQL = `
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES (?, ?, ?, ?)
        `;

                db.execute({
                    sqlText: itemInsertSQL,
                    binds: [orderId, item.product_id, item.quantity, item.price],
                    complete: (err) => {
                        if (err) {
                            console.error("Error inserting order item:", err);
                            return res.status(500).json({ error: "Failed to insert order item" });
                        }

                        insertItem(index + 1); // next item
                    },
                });
            };

            insertItem(0); // start with first item
        },
    });
};








exports.getOrdersByUser = (req, res) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(400).json({ error: "Missing userId parameter" });
    }

    const sql = `
      SELECT 
        o.id AS order_id,
        o.order_date,
        o.total_amount,
        o.status,
        o.name,
        o.mobile,
        o.address,
        o.city,
        o.pincode,
        o.payment_method,
        oi.product_id,
        oi.quantity,
        oi.price,
        p.name AS product_name,
        p.image_url
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      ORDER BY o.order_date DESC
    `;

    db.execute({
        sqlText: sql,
        binds: [userId],
        complete: (err, stmt, rows) => {
            if (err) {
                console.error("Error fetching orders:", err);
                return res.status(500).json({ error: "Failed to fetch orders" });
            }

            if (rows.length === 0) {
                return res.json([]);
            }

            const grouped = {};

            rows.forEach((row) => {
                const orderId = row.ORDER_ID;

                if (!grouped[orderId]) {
                    grouped[orderId] = {
                        order_id: orderId,
                        order_date: row.ORDER_DATE,
                        total_amount: row.TOTAL_AMOUNT,
                        status: row.STATUS,
                        name: row.NAME,
                        mobile: row.MOBILE,
                        address: row.ADDRESS,
                        city: row.CITY,
                        pincode: row.PINCODE,
                        payment_method: row.PAYMENT_METHOD,
                        items: [],
                    };
                }

                if (row.PRODUCT_ID !== null) {
                    grouped[orderId].items.push({
                        product_id: row.PRODUCT_ID,
                        name: row.PRODUCT_NAME,
                        image_url: row.IMAGE_URL,
                        quantity: row.QUANTITY,
                        price: row.PRICE,
                    });
                }
            });

            res.json(Object.values(grouped));
        },
    });
};




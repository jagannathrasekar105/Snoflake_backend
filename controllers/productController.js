const connection = require("../config/db"); // Your Snowflake connection instance

// Reusable executeQuery function for Snowflake
const executeQuery = (sqlText, binds = []) => {
    return new Promise((resolve, reject) => {
        connection.execute({
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

// Get Categories and All Products
exports.getProductCategoriesAndAllProducts = async (req, res) => {
    try {
        // Snowflake does not support multiple statements in one execute call,
        // so we run them separately:

        const categoriesSql = `
      SELECT DISTINCT c.id, c.name 
      FROM categories c
      INNER JOIN products p ON c.id = p.category_id
      ORDER BY c.name;
    `;

        const productsSql = `
      SELECT * FROM products;
    `;

        const categories = await executeQuery(categoriesSql);
        const products = await executeQuery(productsSql);

        res.json({
            categories,
            products,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Database error" });
    }
};

// Get Product Details by Product ID
exports.getProductDetailsById = async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `
      SELECT p.id, p.name, p.description, p.price, p.discount, p.final_price, p.image_url, p.category_id, c.name AS category, 
             p.brand, p.stock_quantity, p.shipping_cost, p.is_featured, p.rating, p.created_at, p.updated_at, p.is_top_selling
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;

        // Snowflake uses ? for binds, pass id inside array
        const rows = await executeQuery(sql, [id]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Error fetching product details:", error);
        res.status(500).json({ error: "Database error" });
    }
};

exports.getTopSellingProducts = async (req, res) => {
    const sql = `SELECT * FROM products WHERE is_top_selling = true`;

    try {
        const result = await executeQuery(sql);
        res.json(result);
    } catch (err) {
        console.error("Error fetching top selling products:", err);
        res.status(500).json({ error: "Database error" });
    }
};
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // important for sending cookies
}));
app.use(cookieParser());
app.use(express.json());

app.use(bodyParser.json());
app.use('/api/auth', userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

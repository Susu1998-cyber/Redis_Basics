require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");

const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    app.listen(process.env.PORT, () => {
      console.log(`Server running on ${process.env.PORT}`);
    });

  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();
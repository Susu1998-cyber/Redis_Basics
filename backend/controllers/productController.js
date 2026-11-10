const Product = require("../models/Product");
const { redisClient } = require("../config/redis");

exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    try {
      await redisClient.del("products:all");
    } catch (redisError) {
      console.error("Redis cache clearing failed:", redisError);
    }

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    // First check Redis
    const cachedProducts = await redisClient.get("products:all");

    if (cachedProducts) {
      console.log("Redis Cache HIT");

      return res.json({
        source: "Redis",
        data: JSON.parse(cachedProducts),
      });
    }

    console.log("Redis Cache MISS");

    // Fetch from MongoDB
    const products = await Product.find().lean();

    // Store result in Redis for 60 seconds
    await redisClient.set("products:all", JSON.stringify(products), { EX: 60 });

    res.json({
      source: "MongoDB",
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Clear list and individual product cache
    await redisClient.del("products:all");
    await redisClient.del(`product:${req.params.id}`);

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const key = `product:${req.params.id}`;

    const cachedProduct = await redisClient.get(key);

    if (cachedProduct) {
      console.log("Product Redis Cache HIT");

      return res.json({
        source: "Redis",
        data: JSON.parse(cachedProduct),
      });
    }

    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await redisClient.set(key, JSON.stringify(product), { EX: 60 });

    res.json({
      source: "MongoDB",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    try {
      await redisClient.del("products:all");
      await redisClient.del(`product:${req.params.id}`);
    } catch (redisError) {
      console.error("Redis cache clearing failed:", redisError);
    }

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
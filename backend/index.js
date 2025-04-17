import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import cors from "cors";
import crypto from "crypto";
import sendEmail from "./helpers/sendEmail.js";
import { v2 as cloudinary } from "cloudinary";
import cron from "node-cron";
import { v4 as uuidv4 } from "uuid";
import streamifier from "streamifier";
import Razorpay from "razorpay";
import generateReceiptPDF from "./helpers/generateReceiptPDF.js";
import { fileURLToPath } from "url";
import fs from 'fs';

dotenv.config();

const PORT = process.env.PORT || 4000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

const SECRET_KEY = process.env.JWT_SECRET;

const ADMIN_EMAIL = "adityakawadkar7@gmail.com";
let ADMIN_PASSWORD = "Admin@123";
let otpStorage = {};

const app = express();

app.use(express.json());
app.use(cors());

//Database Connection with MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB Connection Error:", error));

//API Creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

//Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// // Cloudinary storage setup for product images
// const productStorage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'product_images', // you can customize this folder
//       allowed_formats: ['jpg', 'jpeg', 'png'],
//     },
//   });

//   const productUpload = multer({ storage: productStorage });

// Image Storage Engine with unique filenames
// const storage = multer.diskStorage({
//     destination: "./upload/images",
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         return cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
//     }
// });

// Use memory storage instead of disk
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
});

// // Creating Upload Endpoint for Images
// app.use('/images', express.static('upload/images'));

app.post("/upload", upload.array("product", 4), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: 0,
        message: "No files were uploaded",
      });
    }

    // Upload all files to Cloudinary one by one
    const imageUrls = [];

    for (const file of req.files) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "product_images",
              public_id: `product_${Date.now()}_${Math.floor(
                Math.random() * 10000
              )}`,
            },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();

      imageUrls.push({
        url: result.secure_url,
        filename: result.public_id,
        size: file.size,
      });
    }

    res.json({
      success: 1,
      message: "Files uploaded successfully",
      images: imageUrls,
    });
  } catch (error) {
    console.error("Error uploading files to Cloudinary:", error);
    res.status(500).json({
      success: 0,
      message: "Error uploading files to Cloudinary",
    });
  }
});

//Schema for Creating Products
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: [String],
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  avilable: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
  },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      name: {
        type: String,
        default: "Anonymous",
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        required: true,
      },
      images: {
        type: [String], // URLs to images (uploaded to Cloudinary or similar)
        default: [],
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  // Ensure image is an array - convert single string to array if needed
  const images = Array.isArray(req.body.images)
    ? req.body.images.map((img) => img.url) // Extract only URLs
    : [req.body.images.url];

  const product = new Product({
    id: id,
    name: req.body.name,
    image: images, // Now images is correctly formatted as an array of URLs
    new_price: req.body.new_price,
    old_price: req.body.old_price,
    description: req.body.description,
  });

  console.log(product);
  await product.save();
  console.log("Saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

//Creating API for deleting Products
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({
    success: true,
    name: req.body.name,
  });
});

//Creating API for getting all products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
});

//Schema creating for User model
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiry: {
    type: Date,
  },
});

app.get("/allusers", async (req, res) => {
  let users = await Users.find({});
  console.log("All Users Fetched");
  res.send(users);
});

app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res
      .status(400)
      .json({
        success: false,
        errors: "existing user found with same email address",
      });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();

  const data = {
    user: {
      id: user._id.toString(), // ✅ Corrected here
    },
  };

  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token, userId: user._id.toString() });
});

app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user._id.toString(), // ✅ Corrected here
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token, userId: user._id.toString() });
    } else {
      res.json({ success: false, errors: "Wrong Password" });
    }
  } else {
    res.json({ success: false, errors: "Wrong Email Id" });
  }
});

//my-order by id
// app.get('/myorder/:id', async (req, res) => {
//     try {
//       const userId = req.params.id;
//       const user = await Users.findById(userId);

//       if (!user) {
//         return res.status(404).json({ success: false, message: "User not found" });
//       }

//       // Fetch orders or order details (replace with actual order schema)
//       const orders = await Orders.find({ userId }); // Replace with your order schema

//       res.json({ success: true, orders });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
//   });

//Creating endpoint for Deleting a user
app.post("/removeuser", async (req, res) => {
  const user = await Users.findOne({ _id: req.body.id });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Check if user is logged in by verifying their token
  const token = req.header("auth-token");
  if (token) {
    try {
      const data = jwt.verify(token, "secret_ecom");
      if (data.user.id === req.body.id) {
        // Invalidate token by setting a very short expiration
        const invalidToken = jwt.sign(
          { user: { id: data.user.id } },
          "secret_ecom",
          { expiresIn: "1s" }
        );
      }
    } catch (error) {
      // Token verification failed, user is not logged in
    }
  }

  await Users.findOneAndDelete({ _id: req.body.id });
  console.log("User Removed");

  // Check if removed user was logged in
  let wasLoggedIn = false;
  if (token) {
    try {
      const data = jwt.verify(token, "secret_ecom");
      if (data.user.id === req.body.id) {
        wasLoggedIn = true;
      }
    } catch (error) {}
  }

  res.json({
    success: true,
    message: `User ${user.name} removed successfully`,
    wasLoggedIn: wasLoggedIn,
  });
});

//Creating endpoint for new collection data
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("NewCollection Fetched");
  res.send(newcollection);
});

// Endpoint to verify token
app.get("/verifytoken", async (req, res) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }
  try {
    jwt.verify(token, "secret_ecom");
    return res.json({ success: true });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
});

//Creating endpoint for Popular section
app.get("/popular", async (req, res) => {
  try {
    let products = await Product.find({});
    let popularProducts = products.slice(0, 4); // Get the first 4 products
    console.log("Popular Products Fetched");
    res.send(popularProducts);
  } catch (error) {
    console.error("Error fetching popular products:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//Creating middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res
        .status(401)
        .send({ errors: "Please authenticate using a valid token" });
    }
  }
};

//Creating endpoint for adding products in cart data
app.post("/addtocart", fetchUser, async (req, res) => {
  console.log("Added", req.body.itemId);

  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Added");
});

//Creating endpoint to remove product from cart data
app.post("/removefromcart", fetchUser, async (req, res) => {
  console.log("removed", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Removed");
});

//Creating endpoint to get Cart data
app.post("/getcart", fetchUser, async (req, res) => {
  console.log("GetCart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

//Creating API for adding reviews
app.post(
  "/add-review/:productId",
  fetchUser,
  upload.array("images", 3),
  async (req, res) => {
    const { name, rating, comment } = req.body;
    const { files } = req;

    try {
      // Validation
      if (!rating || !comment) {
        return res
          .status(400)
          .json({ message: "Rating and comment are required" });
      }
      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ message: "Rating must be between 1 and 5" });
      }

      // Upload image buffers to Cloudinary
      const imageUrls = [];

      if (files && files.length > 0) {
        const uploadPromises = files.map((file) => {
          return new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                { resource_type: "image", folder: "review_images" },
                (error, result) => {
                  if (error) {
                    console.log("Cloudinary upload error:", error);
                    reject(error);
                  } else {
                    imageUrls.push(result.secure_url);
                    resolve();
                  }
                }
              )
              .end(file.buffer); // Use .end with buffer instead of .pipe
          });
        });

        await Promise.all(uploadPromises);
      }

      // Find product
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Create and push new review
      const newReview = {
        userId: req.user.id,
        name: name || "Anonymous",
        rating,
        comment,
        images: imageUrls,
        date: new Date(),
      };

      product.reviews.push(newReview);
      await product.save();

      res.status(200).json({ message: "Review added successfully", product });
    } catch (error) {
      console.error("Review Error:", error);
      res.status(500).json({ message: "Error adding review", error });
    }
  }
);

//Creating API for getting reviews of a product
app.get("/get-reviews/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Return only reviews array
    res.status(200).json({ reviews: product.reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews", error });
  }
});

//Creating schema for Order
const Orders = mongoose.model("Orders", {
  orderId: {
    type: String,
    required: true,
    unique: true, // Ensures that orderId is unique
  },
  userId: {
    type: String,
    required: true,
  },
  // Corrected items schema
  items: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  discount: {
    discount_name: {
      type: String,
      default: "", // Optional field, defaults to an empty string if not provided
    },
    discount_amount: {
      type: Number,
      default: 0, // Defaults to 0 if no discount is applied
    },
  },
  amount: {
    type: Number,
    required: true,
  },
  address: {
    addressLine: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ["Placed", "Out for Delivery", "Delivered"],
    default: "Placed",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  payment: {
    type: Boolean,
    default: false,
  },
});

//API to initiate Razorpay order
app.post("/create-razorpay-order", fetchUser, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create Razorpay order" });
  }
});

//Placing user order from frontend
app.post("/placeorder", fetchUser, async (req, res) => {
  try {
    const {
      items,
      amount,
      address,
      discount_name,
      discount_amount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Items are required" });
    }
    if (!amount || isNaN(amount)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Razorpay payment details" });
    }

    // Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Get price info from Product schema
    const detailedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findOne({ name: item.name });
        const price = product ? product.new_price : 0;
        return {
          name: item.name,
          quantity: item.quantity,
          price: price,
        };
      })
    );

    const subtotal = detailedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const newOrder = new Orders({
      orderId,
      userId: req.user.id,
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),
      amount,
      discount: {
        discount_name: discount_name || "",
        discount_amount: discount_amount || 0,
      },
      address,
      status: "Placed",
      payment: true,
    });

    await newOrder.save();

    const cleanedAddress = address.addressLine || "N/A";

  // Send email receipt with PDF attachment
  const user = await Users.findById(req.user.id);
  if (user && user.email) {
    const filePath = path.join(__dirname, 'temp', `receipt-${orderId}.pdf`);

    await generateReceiptPDF({
      orderId,
      date: new Date().toLocaleString(),
      address: cleanedAddress,
      items: detailedItems,
      subtotal,
      amount,
      discount_name: discount_name || "",
      discount_amount: discount_amount || 0,
    }, filePath);

    await sendEmail(
      user.email,
      {
        orderId,
        date: new Date().toLocaleString(),
        address: cleanedAddress,
        items: detailedItems,
        subtotal,
        amount,
        discount_name: discount_name || "",
        discount_amount: discount_amount || 0,
      },
      "order-receipt",
      filePath
    );
  }

    res.status(201).json({ success: true, message: "Order placed", orderId });
  } catch (error) {
    console.error("Place Order Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//Get all Order
app.get("/getallorders", async (req, res) => {
  try {
    console.log("Fetching all orders...");

    // Retrieve all orders from the database
    const orders = await Orders.find({}).sort({ date: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Update order status
app.put("/updateorderstatus/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    // Find and update the order status
    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

        // Get user details from order
        const user = await Users.findById(updatedOrder.userId);


        if (user && user.email) {

                // Fetch detailed product info (price per item)
      const detailedItems = await Promise.all(
        updatedOrder.items.map(async (item) => {
          const product = await Product.findOne({ name: item.name });
          const price = product ? product.new_price : 0;
          return {
            name: item.name,
            quantity: item.quantity,
            price: price,
            total: price * item.quantity,
          };
        })
      );

      const subtotal = detailedItems.reduce(
        (acc, item) => acc + item.total,
        0
      );
      // Send order status update email
      await sendEmail(
        user.email,
        {
          name: user.name,
          orderId: updatedOrder.orderId,
          status: updatedOrder.status,
          date: new Date(updatedOrder.date).toLocaleString(),
          items: detailedItems,
          subtotal,
          amount: updatedOrder.amount,
          discount_name: updatedOrder.discount?.discount_name || "",
          discount_amount: updatedOrder.discount?.discount_amount || 0,
          address: updatedOrder.address?.addressLine || "N/A",
        },
        "order-status-update"
      );
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Getting Orders for one particular user
app.get("/getmyorders", fetchUser, async (req, res) => {
  try {
    console.log(`Fetching orders for user: ${req.user.id}`);

    // Get orders for the specific user
    const userOrders = await Orders.find({ userId: req.user.id }).sort({
      date: -1,
    });

    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user",
      });
    }

    res.status(200).json({
      success: true,
      orders: userOrders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//forgot password
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await Users.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    // Send the email with the reset link
    await sendEmail(user.email, resetLink, "reset"); // Use the sendEmail function

    res.json({
      message:
        "If you are a registered user, a recovery email will be sent to your email address.",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});

// Reset Password Endpoint
app.post("/reset-password", async (req, res) => {
  const { resetToken, newPassword } = req.body;

  // Find the user with the matching reset token and check if the token is expired
  const user = await Users.findOne({ resetToken });

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid reset token" });
  }

  if (user.resetTokenExpiry < Date.now()) {
    return res
      .status(400)
      .json({ success: false, message: "Reset token has expired" });
  }

  // Update the user's password
  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successfully" });
});

// Handle Reset Password Link and Verify Token
app.get("/reset-password/:resetToken", async (req, res) => {
  const { resetToken } = req.params;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  try {
    const user = await Users.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect(`${frontendUrl}/reset-password?error=invalid_token`);
    }

    // Redirect to frontend reset password page with token
    res.redirect(`${frontendUrl}/reset-password/${resetToken}`);
  } catch (err) {
    console.error("Token verification error:", err);
    res.redirect(`${frontendUrl}/reset-password?error=server_error`);
  }
});

// Creating schema for Contact Us
const ContactUs = mongoose.model("ContactUs", {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Creating endpoint for Contact Us
app.post("/send-message", async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Validate incoming data
  if (!name || !email || !phone || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const contactMessage = new ContactUs({ name, email, phone, message });
    await contactMessage.save();
    res
      .status(201)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ success: false, message: "Error saving message" });
  }
});

// Creating endpoint to fetch all user messages
app.get("/allusermessage", async (req, res) => {
  try {
    const messages = await ContactUs.find({});
    res.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching messages" });
  }
});

app.post("/delete-message", async (req, res) => {
  console.log("Deleting message:", req.body.id);

  try {
    let messageData = await ContactUs.findById(req.body.id);
    if (!messageData) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    await ContactUs.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ success: false, message: "Error deleting message" });
  }
});

//Schema for Coupons
const Coupon = new mongoose.model("Coupon", {
  name: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  description: {
    type: String,
    required: false, // Optional field
    default: "", // Default value as empty string
  },
  expiry: {
    type: Date,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
});

//Add Coupon
app.post("/addcoupon", async (req, res) => {
  const { name, description, expiry, discount } = req.body;

  // 🔍 Validate Fields
  if (!name || !expiry || !discount) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    // 🔹 Check if coupon already exists
    const existingCoupon = await Coupon.findOne({ name });
    if (existingCoupon) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Coupon with this name already exists.",
        });
    }

    // 📅 Create and save the coupon
    const newCoupon = new Coupon({
      name: name.toUpperCase(), // Ensure name is stored in uppercase
      description: description || "",
      expiry: new Date(expiry), // Convert expiry to Date format
      discount: parseFloat(discount),
    });

    await newCoupon.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Coupon added successfully!",
        coupon: newCoupon,
      });
  } catch (error) {
    console.error("Error adding coupon:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error. Please try again.",
      });
  }
});

// Get All Coupons
app.get("/getallcoupons", async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ expiry: 1 }); // Sort by expiry date (earliest first)
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to retrieve coupons. Please try again.",
      });
  }
});

//Delete Coupon Endpoint
app.delete("/deletecoupon", async (req, res) => {
  const { name } = req.body;

  // 🔍 Validate Name Field
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Coupon name is required." });
  }

  try {
    // 🔹 Find and Delete Coupon
    const deletedCoupon = await Coupon.findOneAndDelete({
      name: name.toUpperCase(),
    });

    if (!deletedCoupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "Coupon deleted successfully!" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error. Please try again.",
      });
  }
});

//Auto-Delete after coupon validitiy ends..
cron.schedule("0 0 * * *", async () => {
  console.log("⏰ Running coupon cleanup task...");

  const today = new Date();
  today.setDate(today.getDate() - 1); // Check for 1 day after expiry

  try {
    // 🔥 Delete coupons expired 1 day ago
    const result = await Coupon.deleteMany({
      expiry: { $lte: today },
    });

    console.log(`✅ ${result.deletedCount} expired coupon(s) deleted.`);
  } catch (error) {
    console.error("❌ Error deleting expired coupons:", error);
  }
});

//admin-login
app.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const adminToken = jwt.sign({ email }, SECRET_KEY, { expiresIn: "2h" });
    return res.json({ success: true, token: adminToken });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }
});

// Generate OTP for Admin Password Reset
app.post("/admin-forgot-password", async (req, res) => {
  const { email } = req.body;

  if (email !== ADMIN_EMAIL) {
    return res.status(400).json({ success: false, message: "Invalid email" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStorage[email] = otp; // Store OTP temporarily

  await sendEmail(email, otp, "otp"); // Send OTP email
  return res.json({ success: true, message: "OTP sent to email" });
});

// Verify OTP and Reset Password
app.post("/admin-reset-password", (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (email !== ADMIN_EMAIL) {
    return res.status(400).json({ success: false, message: "Invalid email" });
  }

  if (otpStorage[email] !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  ADMIN_PASSWORD = newPassword; // Update password
  delete otpStorage[email]; // Clear OTP after use
  return res.json({ success: true, message: "Password updated successfully" });
});

// app.listen(PORT, (error) => {
//   if (!error) {
//     console.log("Server Running on Port " + PORT);
//   } else {
//     console.log("Error:" + error);
//   }
// });

export default app;

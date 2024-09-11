const express = require('express');
const connectDB = require("./config/db");
const dotenv = require('dotenv');
const cors = require("cors");
const categoryRouters = require("./routers/categoryRouters");
const productRouters = require("./routers/productRouters");
const authRouters = require("./routers/authRouters");
const paymentRouters = require("./routers/paymentRouters");
const cartRouters = require("./routers/cartRouters");

const app = express();

dotenv.config();
connectDB();

app.use(cors({
     origin: "http://localhost:5173",
    allowedHeaders: ["Content-Type", "Authorization" , "auth-token"],
     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
 }));

app.use(express.json());
 app.use("/uploads", express.static("uploads"));
app.use("/", categoryRouters);
 app.use("/", productRouters);
 app.use("/", authRouters);
 app.use("/", cartRouters);
 app.use("/", paymentRouters);

 const port = process.env.PORT || 3000;
 app.listen(port, () => console.log(`Listening on port ${port}!..`));
 
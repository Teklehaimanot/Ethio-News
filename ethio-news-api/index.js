const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

// Allowed origins array
const allowedOrigins = [
  "http://localhost:8081",
  "http://78.47.152.86:4001",
  "http://localhost:3000",
  "https://user-management-ethio-news.vercel.app",
  "https://ethionews.smartcsvtool.com",
  "https://ethio-news.diroconsultancy.com",
  "http://ethio-news.diroconsultancy.com",
];

// CORS options with dynamic origin handling
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "x-auth"], // Add any other headers your client sends
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("We are on the home page");
});

app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/news", require("./routes/newsRoutes"));
app.use("/api/v1/image", require("./routes/imageRoutes"));
app.use("/api/v1/aboutNdmc", require("./routes/aboutNdmcRoute"));
app.use("/api/v1/pushNotification", require("./routes/pushNotificationRoutes"));

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server is running on port ${port}`));

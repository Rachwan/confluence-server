import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/MongoConfig.js";
import cityRoutes from "./routes/cityRoutes.js";
import platformRoutes from "./routes/platformRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import collaborationRoutes from "./routes/collaborationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import {
  login,
  logOut,
  loggedInUser,
  verifyToken,
  addUserWithGoogle,
  forgetPassword,
  resetPassword,
} from "./middleware/authentication.js";
import soonRoutes from "./routes/soonRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";

const app = express();

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

const corsOption = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://confluence-client.vercel.app",
    "https://confluence-server.onrender.com",
    // process.env.FRONTEND_ORIGIN,
    // "https://confluence-8fmfrodru-rachwan-harbs-projects.vercel.app",
    // "https://confluence-k6a850yw0-rachwan-harbs-projects.vercel.app",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  // exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello from the MERN backend!");
});

app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is Running on port " + PORT);
  } else {
    console.log("Error: ", error);
  }
});
connectDB();

app.use("/city", cityRoutes);
app.use("/contact", contactRoutes);
app.use("/soon", soonRoutes);
app.use("/subscriber", subscriberRoutes);

app.use("/platform", platformRoutes);
app.use("/category", categoryRoutes);
app.use("/collaboration", collaborationRoutes);

app.use("/user", userRoutes);
app.post("/login", login);
app.post("/logout", logOut);
app.get("/logged-in-user", verifyToken, loggedInUser);
app.post("/googleauth", addUserWithGoogle);
app.post("/forget-password", forgetPassword);
app.put("/reset/password", resetPassword);

app.use("/images", express.static("images"));

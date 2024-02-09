import express from "express";
import "dotenv/config";
import connectDB from "./config/MongoConfig.js";
import cityRoutes from "./routes/cityRoutes.js";
import platformRoutes from "./routes/platformRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

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

app.use("/images", express.static("Images"));

app.use("/city", cityRoutes);
app.use("/platform", platformRoutes);
app.use("/category", categoryRoutes);
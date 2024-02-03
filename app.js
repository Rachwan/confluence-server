import express from 'express';
import "dotenv/config";
import connectDB from "./config/MongoConfig.js";


const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello from the MERN backend!');
});

app.listen(PORT, (error) =>{ 
  if(!error) {
      console.log("Server is Running on port "+ PORT) 
  } else {
      console.log("Error: ", error)
  }
} 
);
connectDB()
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./connect.js";
import postRoutes from "./routes/postRoutes.js"


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use('/api/v1/post',postRoutes);


const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(8000, () => console.log("server started at port: 8000"));
  } catch (error) {
    console.log(error);
  }
};

startServer();

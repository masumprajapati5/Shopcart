import mongoose, { mongo } from "mongoose";
import config from "./config.js"
const connectDb=async()=>{
  await mongoose.connect(config.MONGO_URL)

}

export default connectDb
//import mongoose from "mongoose";

//const connectDB = async () => {
  //try {
    //const conn = await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser/useUnifiedTopology not needed in modern mongoose
    //});
    //console.log(`MongoDB Connected: ${conn.connection.host}`);
  //} catch (error) {
    //console.error(`MongoDB connection error: ${error.message}`);
    //process.exit(1);
  //}
//  };

//export default connectDB;


import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn; // return existing connection
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10, // limit simultaneous connections
    }).then((m) => m);
  }

  cached.conn = await cached.promise;
  console.log(`MongoDB Connected: ${cached.conn.connection.host}`);
  return cached.conn;
};

export default connectDB;

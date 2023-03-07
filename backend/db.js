const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/inotebook?directConnection=true";
// const connectToMongo = () => {
//   mongoose.connect(mongoURI, () => {
//     console.log("Connect to mongo successfully");
//   });
// };
const connectDB = async () => {
  try {
    mongoose.connect(mongoURI);
    console.log("Mongo connected");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

module.exports = connectDB;

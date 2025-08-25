const mongoose = require("mongoose");
const Receiver = require("./receiver.js");
const Donator = require("./donator.js");
const url = "mongodb://localhost:27017/team19db";
mongoose
  .connect(url, { useUnifiedTopology: true })
  .then(async () => {
    console.log("MongoDB connected!");
    
    mongoose.connection.close();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

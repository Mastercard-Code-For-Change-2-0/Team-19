const mongoose = require("mongoose");
const Receiver = require("./receiver.js");
const Donator = require("./donator.js");
const url = "mongodb://localhost:27017/team19db";
mongoose
  .connect(url, { useUnifiedTopology: true })
  .then(async () => {
    console.log("MongoDB connected!");
    await Donator.deleteMany({});
    await Receiver.deleteMany({});
    const donator = new Donator({
      name: "aman",
      passport: "faf",
      email: "abe@",
      address: "grea",
      inNeed: [
        {
          photos: [],
          description: "",
          quantity: 10,
        },
      ],
      history: [],
    });

    await donator.save();
    console.log("Sample Donator saved!");

    const receiver = new Receiver({
      name: "ngo",
      passport: "jaoj",
      email: "bob@afoj",
      address: "fjwj",
      needs: [
        {
          photos: [],
          description: "good",
          quantity: 5,
          category: "book",
        },
      ],
      history: [],
    });

    await receiver.save();
    console.log("Sample Receiver saved!");

    mongoose.connection.close();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

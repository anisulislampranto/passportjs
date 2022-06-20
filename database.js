const mongoose = require("mongoose");

exports.connectMongoose = async () => {
  mongoose
    .connect(process.env.URI)
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => console.error("Could not connect to MongoDB...", err));
};

const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true,
  },
  password: String,
});

exports.User = mongoose.model("User", userSchema);

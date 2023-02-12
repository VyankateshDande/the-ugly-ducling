const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: String
});

module.exports = new mongoose.model("users", userSchema);
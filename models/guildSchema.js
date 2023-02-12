const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
    guildId: String
})

module.exports = mongoose.model("guilds", guildSchema)
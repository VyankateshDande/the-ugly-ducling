const { SlashCommandBuilder } = require("discord.js");
const Command = require("../classes/command");

module.exports = new Command({
    type: "Both",
    adminOnly: false,
    commandFunc(bot, ...args) {
        args[0].reply("Pong!");
    },
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong"),
    rateLimits: 15
})
const mongoose = require("mongoose");
const fs = require("fs");
const Bot = require("./classes/bot");
const config = require("./config.json")

mongoose.set("strictQuery", false)

const bot = new Bot(config);

// Load event handlers
const eventHandlerFolder = fs.readdirSync("./eventhandlers").filter(fileName => fileName.endsWith(".js"))
for (i in eventHandlerFolder) {
    bot.addEventHandler(require("./eventhandlers/" + eventHandlerFolder[i]))
}

// Load commands
const commandsFolder = fs.readdirSync("./commands").filter(fileName => fileName.endsWith(".js"))
for (i in commandsFolder) {
    bot.addCommand(require("./commands/" + commandsFolder[i]))
}
bot.startBot();
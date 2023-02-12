const eventhandler = require("../classes/eventhandler");

module.exports = new eventhandler("messageCreate", async (bot, ...args) => {
    prefix = bot.prefix;
    const arguments = args[0].content.slice(prefix.length).split(" ");
    arguments.forEach((value, index, array) => array[index] = value.trim());
    const command = bot.commands.get(arguments.shift().toLowerCase());
    if (!command) return;

    if (
        command.type == "Both" ||
        command.type == "Text"
    ) command.execute(args[0].author.id, bot, ...args, arguments)
})
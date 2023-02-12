const eventHandler = require("../classes/eventhandler");

module.exports = new eventHandler("ready", async (Bot, Client) => {
    console.log(`Logged in as ${Client.user.tag}`);
}, true)
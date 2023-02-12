const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, token } = require("./config.json");


const commands = [];
const slashCommands = fs
    .readdirSync(`./commands`)
    .filter((f) => f.endsWith(".js"));

for (const file of slashCommands) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(token);

rest.put(Routes.applicationCommands(clientId), {
    body: commands,
}).then(data => {
    console.log('Deployed commands sucessfully')
}).catch(error => {
    console.log(error)
    return
})
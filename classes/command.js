const { SlashCommandBuilder, CommandInteraction } = require("discord.js");
const Bot = require("./bot");
const cache = require("./cache");
const CooldownTracker = require("./cooldowns.js")

class Command {
    name;
    data;
    #commandFunc;
    adminOnly;
    cooldown = new cache(5 * 60000);
    rateLimits;
    type;

    /**
     * @param {{
     *  type: "Slash" | "Text" | "Both"
     *  data: SlashCommandBuilder | { name: String },
     *  commandFunc: Function,
     *  adminOnly: Boolean,
     *  rateLimits: Number
     * }} param0 
     */
    constructor({
        type,
        data,
        commandFunc,
        adminOnly = false,
        rateLimits = 10
    }) {
        this.name = data.name;
        this.data = data;
        this.#commandFunc = commandFunc;
        this.adminOnly = adminOnly;
        this.rateLimits = rateLimits;
        this.type = type;
    };

    /**
     * 
     * @param {String} userId Id of the user calling the command
     * @param  {CommandInteraction} interaction
     * @param {Bot} Bot
     * @returns {undefined}
     */
    execute(userId, Bot, ...args) {
        let userCooldown = this.cooldown.get(userId);
        if (userCooldown == undefined) {
            userCooldown = this.cooldown.set(userId, new CooldownTracker(60000, this.rateLimits));
        };
        let onCooldown = new Boolean()
        if (this.adminOnly) {
            if (!Bot.isAdmin(userId)) {
                this.defaults(1);
                return;
            } else {
                onCooldown = userCooldown.add();
            }
        } else onCooldown = userCooldown.add();

        if (onCooldown) this.defaults(0);
        else this.#commandFunc(Bot, ...args)
        return
    }

    /**
     * 
     * @param {Number} number Default replies
     * 
     * 0 = Cooldown
     * 
     *  1 = Admin Only
     * 
     */
    defaults(number, ...args) {
        switch (number) {
            case 0:
                args[0].reply("You're on cooldown. Wait some time before trying again.");
                break
            default:
                args[0].reply("An error occurred while executing this command. Please try again.")
                break
        }
        return;
    }
}

module.exports = Command
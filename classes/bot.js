const { Client, PresenceData } = require("discord.js");
const { mongoose } = require("mongoose");
const cache = require("./cache.js")
const eventHandler = require("./eventhandler.js")

class Bot {
    bot;
    ms = require("ms");
    ctags = require("common-tags");
    cache = {};
    #config;
    #db;
    events = [];
    commands = new Map();
    prefix;

    /**
     * @constructor
     * @param {{
     *  token: String,
     *  dbase_url: String, 
     *  intents: String[],
     *  clientId: String,
     *  presence: PresenceData,
     *  prefix: String,
     *  admins: String[]
     * }} config 
     */
    constructor(config) {
        this.#config = config;
        this.prefix = config.prefix
    };

    isAdmin(userId) {
        return this.#config.admins.includes(userId)
    }

    async #makeBot() {
        this.bot = new Client({
            intents: this.#config.intents,
            allowedMentions: {
                parse: ["roles", "users"],
                repliedUser: false
            },
            failIfNotExists: false,
            presence: this.#config.presence
        });
        await this.#connectDB();
        await this.#createCache();
        return
    } ''

    async #connectDB() {
        await mongoose.connect(this.#config.dbase_url);
        this.#db = {
            users: require("../models/userSchema.js"),
            guilds: require("../models/guildSchema.js")
        };
        return;
    };

    async #createCache() {
        this.cache = {
            users: new cache(5 *60 *1000),
            guilds: new cache(15 *60 *1000),
            getUser: async (userId) => {
                try {
                    let user = this.cache.users.get(userId);
                    if (user == undefined) {
                        user = await this.#db.users.findOne({
                            userId: userId
                        })

                        if (user == undefined) {
                            user = new this.#db.users({
                                userId: userId
                            });
                        }

                        this.cache.setUser(user)
                    }

                    return user
                } catch (error) {
                    console.log(error);
                }
            },
            getGuild: async (guildId) => {
                try {
                    let guild = this.cache.guilds.get(guildId);
                    if (guild == undefined) {
                        guild = await this.#db.guilds.findOne({
                            guildId: guildId
                        })

                        if (guild == undefined) {
                            guild = new this.#db.guilds({
                                guildId: guildId
                            });
                        }

                        this.cache.setGuild(guild)
                    }

                    return guild
                } catch (error) {
                    console.log(error);
                }
            },
            setUser: async (user) => {
                try {
                    this.cache.users.set(user.userId, user);
                    await user.save();
                    return true;
                } catch (error) {
                    console.log(error);
                    return false;
                };
            },
            setGuild: async (guild) => {
                try {
                    this.cache.guilds.set(guild.guildId, guild);
                    await guild.save();
                    return true;
                } catch (error) {
                    console.log(error);
                    return false;
                };
            }
        }
        return;
    };


    /**
     * 
     * @param {eventHandler} eventhandler 
     */
    async addEventHandler(eventhandler) {
        if (eventhandler.eventName == "interactionCreate") {
            throw Error("Interaction events are handled internally.")
        }
        this.events.push(eventhandler);
    };

    async addCommand(command) {
        this.commands.set(command.data.name, command)
        return
    }

    async startBot() {
        await this.#makeBot();

        // Listen for events
        for (let i in this.events) {
            let handler = this.events[i];
            if (handler.once) {
                this.bot.once(handler.eventName, async (...args) => {
                    handler.eventHandler(this, ...args)
                });
            } else {
                this.bot.on(handler.eventName, async (...args) => {
                    handler.eventHandler(this, ...args)
                });
            }
        }

        this.bot.on("interactionCreate", async (...args) => {
            this.commands.get(args[0].commandName).execute(args[0].user.id, this, ...args)
        })

        this.bot.login(this.#config.token);
    }
}

module.exports = Bot;
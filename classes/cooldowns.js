class CooldownTracker {
    lifetime;
    limit;
    #cooldowns = new Array();
    /**
     * @constructor
     * @param {Number} lifetime Amount of lifetime 
     * @param {Number} limit Maximum nnumber of things in set lifetime
     */
    constructor(lifetime, limit) {
        this.lifetime = lifetime;
        this.limit = limit;
        this.#sweep();
    }

    add() {
        if (this.#cooldowns.length < this.limit) {
            this.#cooldowns.push(Date.now());
            return true;
        } else return false;
    }

    #sweep() {
        setInterval(() => {
            try {
                let key = this.#cooldowns[0];
                if (
                    (Date.now() - key) > this.lifetime
                ) {
                    this.#cooldowns.shift();
                };
            } catch { }
        }, 100);
    };
}

module.exports = CooldownTracker
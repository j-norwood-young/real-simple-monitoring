const mongodb = require("mongodb");
const MongoClient = require('mongodb').MongoClient;

class MongoDB_Monitor {
    constructor(params) {
        this.params = Object.assign({
            socketTimeoutMS: 1000
        }, params)
        const servers = this.params.servers;
        if (!servers) throw "Missing servers parameter";
        if (!Array.isArray(servers)) throw "Parameter servers needs to be an array";
        this.servers = servers;
    }

    async check(id) {
        const successes = [];
        const errors = [];
        const warnings = [];
        for (let server of this.servers) {
            let safe_server = server.replace(/\/\/.*@/,"//***:***@")
            try {
                console.log(`Testing MongoDB server ${server}`)
                const mongo_client = new MongoClient(server, {
                    connectTimeoutMS: 1000,
                    serverSelectionTimeoutMS: 1000,
                    socketTimeoutMS: 1000
                });
                await mongo_client.connect();
                await mongo_client.db("admin").command({ ping: 1 });
                successes.push(`Connected to ${server}`);
            } catch(err) {
                errors.push({ safe_server, err });
            }
        }
        return { successes, errors, warnings };
    }
}

module.exports = MongoDB_Monitor;
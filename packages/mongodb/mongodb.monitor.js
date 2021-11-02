const Monitor = require("@real-simple-monitoring/shared/monitor");
const MongoClient = require('mongodb').MongoClient;

class MongoDB_Monitor extends Monitor {
    constructor(params) {
        super(params);
        this.params = Object.assign({
            socketTimeoutMS: 1000
        }, params)
    }

    async check(id) {
        for (let server of this.servers) {
            let safe_server = this.safe_server(server)
            try {
                console.log(`Testing MongoDB server ${server}`)
                const mongo_client = new MongoClient(server, {
                    connectTimeoutMS: 1000,
                    serverSelectionTimeoutMS: 1000,
                    socketTimeoutMS: 1000
                });
                await mongo_client.connect();
                await mongo_client.db("admin").command({ ping: 1 });
                this.successes.push(`Connected to ${safe_server}`);
            } catch(err) {
                this.errors.push({ safe_server, err });
            }
        }
    }
}

module.exports = MongoDB_Monitor;
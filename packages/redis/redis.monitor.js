const Monitor = require("@real-simple-monitoring/shared/monitor");
const createClient = require("redis").createClient;

class Redis_Monitor extends Monitor {
    constructor(params) {
        super(params);
    }

    async check() {
        for (let server of this.servers) {
            let safe_server = this.safe_server(server)
            try {
                console.log(`Testing Redis server ${server}`)
                const client = createClient({ url: server })
                await client.connect();
                const result = await client.CLUSTER_INFO()
                if (result.state !== "ok") throw `Cluster not okay on ${safe_server}`
                this.successes.push(`Connected to ${safe_server}`);
            } catch(err) {
                console.error(err);
                this.errors.push({ safe_server, err });
            }
        }
    }
}

module.exports = Redis_Monitor;
const Monitor = require("@real-simple-monitoring/shared/monitor");
const axios = require("axios").default;

class Elasticsearch_Monitor extends Monitor {
    constructor(params) {
        super(params);
    }

    async check(id) {
        for (let server of this.servers) {
            let safe_server = this.safe_server(server)
            try {
                console.log(`Testing Elasticsearch server ${server}`)
                const result = await axios.get(`${server}/_cluster/health`)
                if (result.data.status === "red") throw `Status red for ${safe_server}`;
                if (result.data.status === "yellow") this.warnings.push(`Status yellow for ${save_server}`)
                this.successes.push(`Connected to ${safe_server}`);
            } catch(err) {
                this.errors.push({ safe_server, err });
            }
        }
    }
}

module.exports = Elasticsearch_Monitor;
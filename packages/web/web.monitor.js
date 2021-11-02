const Monitor = require("@real-simple-monitoring/shared/monitor");
const axios = require("axios").default;

class Web_Monitor extends Monitor {
    constructor(params) {
        super(params);
        this.params.params = Object.assign({
            timeout: 1000
        }, params)
    }

    async check() {
        for (let server of this.servers) {
            let safe_server = this.safe_server(server)
            try {
                console.log(`Testing Web server ${server}`)
                const result = await axios.get(server, this.params.params);
                this.successes.push(`Connected to ${safe_server}`);
                if (this.params.expected) {
                    const regex = new RegExp(this.params.expected);
                    if (!regex.test(result.data)) throw `Expected result not matched for ${safe_server}`
                    this.successes.push(`Expected result ${this.params.expected} matched for ${safe_server}`);
                }
            } catch(err) {
                this.errors.push({ safe_server, err });
            }
        }
    }
}

module.exports = Web_Monitor;
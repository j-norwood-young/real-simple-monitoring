class Monitor {
    constructor(params) {
        this.params = Object.assign({}, params);
        this.successes = [];
        this.errors = [];
        this.warnings = [];
        const servers = this.params.servers;
        if (!servers) throw "Missing servers parameter";
        if (!Array.isArray(servers)) throw "Parameter servers needs to be an array";
        this.servers = servers;
    }

    async check() {
        // Implement your check
        this.warnings.push("Monitor check not implemented")
        return {
            success: this.successes, errors: this.errors, warnings: this.warnings
        }
    }

    safe_server(server) {
        return server.replace(/\/\/.*@/,"//***:***@");
    }
}

module.exports = Monitor;
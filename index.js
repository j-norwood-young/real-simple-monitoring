const http = require('http');
const config = require("config");
const fs = require("fs");
const path = require("path")
const url = require("url")

const checkServices = async() => {
    const errors = {
        system: []
    };
    const successes = {
        system: []
    };
    const warnings = {
        system: []
    };
    for (let service of config.services) {
        try {
            const result = await checkService(service);
            errors[service] = result.errors;
            successes[service] = result.successes;
            warnings[service] = result.warnings;
        } catch(err) {
            errors["system"].push(`Error checking service ${service}`)
        }
    }
    return { errors, successes, warnings }
}

const checkService = async(service_name) => {
    try {
        const Service = require(`./packages/${service_name}`);
        const service = new Service(config.get(service_name));
        await service.check();
        return {
            successes: service.successes,
            warnings: service.warnings,
            errors: service.errors
        };
    } catch(err) {
        console.error(err);
        throw(`Could not check service ${service}`)
    }
}

const serveFavicon = async(req, res) => {
    const baseURL =  req.protocol + '://' + req.headers.host + '/';
    const pathname = new URL(req.url, baseURL).pathname;
    const FAVICON = path.join(__dirname, 'assets', 'favicon.png');
    if (req.method === 'GET' && pathname === '/favicon.ico') {
        res.setHeader('Content-Type', 'image/png');
        fs.createReadStream(FAVICON).pipe(res);
        return true;
    }
}

const requestListener = async function (req, res) {
    if (await serveFavicon(req, res)) return;
    const result = await checkServices();

    let error_count = 0;
    for (let service in result.errors) {
        error_count += result.errors[service].length;
    }
    if (req.url === "/successes") {
        res.writeHead(200);
        res.write(JSON.stringify(result.successes, null, "   "))
        res.end();
    } else if (req.url === "/warnings") {
        res.writeHead(200);
        res.write(JSON.stringify(result.warnings, null, "   "))
        res.end();
    } else if (error_count) {
        res.writeHead(500);
        res.write(`Errors: ${error_count}\n`)
        res.write(JSON.stringify(result.errors, null, "   "))
        res.end();
    } else {
        res.writeHead(200);
        res.write('OK!');
        res.end();
    }
}

const Server = () => {
    try {
        const server = http.createServer(requestListener);
        const port = process.env.PORT || process.env.NODE_PORT || config.port || 8282;
        server.listen(port);
        console.log(`real-simple-monitoring listening on port ${port}`)
        return server;
    } catch(err) {
        console.error(err);
    }
}
if (!process.env.JEST_WORKER_ID) Server();

module.exports = http.createServer(requestListener);
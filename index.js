const http = require('http');
const config = require("config");

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
        const Service = require(`./components/${service_name}.monitor`);
        const service = new Service(config.get(service_name));
        const result = await service.check();
        return result;
    } catch(err) {
        console.error(err);
        throw(`Could not check service ${service}`)
    }
}

const requestListener = async function (req, res) {
    const result = await checkServices();
    let error_count = 0;
    for (let service in result.errors) {
        error_count += result.errors[service].length;
    }
    if (error_count) {
        res.writeHead(500);
        res.write(`Errors: ${error_count}\n`)
        res.write(JSON.stringify(result.errors, null, "   "))
        res.end();
    } else {
        res.writeHead(200);
        res.end('OK!');
    }
}

const main = () => {
    try {
        const server = http.createServer(requestListener);
        const port = process.env.PORT || process.env.NODE_PORT || 8282;
        server.listen(port);
        console.log(`real-simple-monitoring listening on port ${port}`)
    } catch(err) {
        console.error(err);
    }
}

main();
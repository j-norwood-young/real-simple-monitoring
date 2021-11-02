# Real Simple Monitoring.

## Is all your shit running? OK!

Real Simple Monitoring has one job. It checks if your services are running, and displays an "OK!" if they are. 

## So what is Real Simple Monitoring?

Real Simple Monitoring checks if your services are working as expected. It is easy to configure and run. And if everything is running okay, it simply displays "OK!"

## That's nice, but what's the point?

The point is that it's really easy to use something like Google's Uptime Check to alert you if one of your services goes down. Simply create an uptime check that expects the output "OK!" and point it at your server. If it doesn't get an "OK!", you can send yourself an SMS, email, Slack message, or Google Cloud app alert.

## Why's it better than my fancy all-singing, all-dancing monitor?

- It's really easy to configure
- You don't need to install anything on the monitored servers for it to work
- It will pick up on problems that might otherwise be invisible on a regular uptime check, such as a single node of a cluster going down

## What services are monitored?

### ElasticSearch

The health of the cluster is monitored. If it's yellow, you'll get a warning. If it's red, it's Not OK!

### MongoDB

We check that we can connect to and ping the servers.

### Web

We check that we can connect to the web (or any internet service really), and that the result includes an expected response.

## What if I want to monitor something else?

It's pretty easy to write a new module. See the `/packages` for examples. Else contact me (jason@10layer.com) and pay me to write your check ;) 

## Configuration

We use the [config](https://www.npmjs.com/package/config) package to configure our system. Copy the `config/default.json` to `config/production.json`, and then edit it for your needs. 

The `services` section is an array describing which services to run for each check.

Each service then has a section, with an array of `servers`. You can also add additional parameters, depending on the service. Eg. `web` has an `expected` array to test for expected content, and a `timeout` (which defaults to 1000ms). 

## Running

Assuming you've created a `config/production.json` file, you can run your server using `env NODE_ENV=production node index.js`. Then browse to http://your-server.com:8282 and, should everything be working, you'll get an "OK!".

It defaults to port 8282, but you can set the port by setting the environmental variable `PORT`, `NODE_PORT`, or setting "port" in the config file. 

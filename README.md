# NODE EXPRESS STARTER PACK

## Features
* All errors (including asynchronous) are "piped" to http response
* IoC container helps you to configure everything in 1 place
* Code is ready to be tested since it does not "require" dependencies
* Authorization, registration ready
* Eslint configuration
* Husky
* Sample Models
* Swagger docs sample
* Docker, docker-compose, pm2
* Routers, controllers and services logic are separated to make code reuasble
* Configuration is provided through environment vars
* Usage of `debug` package to make logs output filterable

## Steps to run

### For development
1. Set up a running Postgres instance (can be a docker) with a database
2. Create `.env` file with content similar to `env.example`
2. run `npm run migrate-up`
3. run `npm run devstart`

### For production
1. Check email settings
2. Check `.env` for `NODE_ENV` (or wherever you keep your ENVs) 
3. run `docker-compose up`

## TODO

* Configure saving logs to files
* Store authorizations at redis
* Switch to `fastify`
* Add html+js into public folder to add debug possibilities
* Add AWS S3 + multer for file uploads
* Add more `assert`'ions to check everything is configured well
* Add schema validation for requests

## ISSUES

+ If husky does not 'bark', try
    + update git
    + run `npm install --save-dev husky` 

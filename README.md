[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md) 

# OSPO_API

This API is built using nodejs/express to access the [OSPO_Database](). The OSPO Database and resources are more clearly described in the Curvenote JupyterBook here.

The API is currently constructed with embedded version `v1.0`. The individual functions for the API are within the route-set in [v1.0/routes/data.js](./v1.0/routes/data.js) structured around SQL queries that access the database.

## Contributors

* [![orcid](https://img.shields.io/badge/orcid-0000--0002--2700--4605-brightgreen.svg)](https://orcid.org/0000-0002-2700-4605) [Simon Goring](http://goring.org)

## Code of Conduct

## How to Use This Repository

### Connecting to a Database

The SQL to build the database can be found in the OSPO_Database repository.

The database connection is managed in the `./database/pgp_db.js` file, using environment variables. Within the larger project this is managed through a `docker-compose.yml`, but it can be managed locally using a `.env` file with parameters that match with the parameters required to connect to the **Postgres** Database:

```
RDS_HOSTNAME
RDS_USERNAME
RDS_DATABASE
RDS_PASSWORD
RDS_PORT
SSL_CERT
TIMEOUT
```

### Running the API

The API is built using node.js and express.js using [yarn](https://yarnpkg.com/) as a package manager. To initialize the API, first, clone the repository:

```bash
git clone git@github.com:UW-Madison-DSI/OSPO_API.git
```

Then, move to the containing folder and run:

```bash
yarn install
```

At this point the packages used in the API will be installed locally and you can run the API using:

```bash
yarn run dev
```

## Building with Docker

The dockerfile `api.Dockerfile` is intended to provide a reproducible container environment for the API, either to run the API locally, or as part of a Docker Compose object.

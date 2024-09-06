let pgPromise = require('pg-promise');
let promise = require('bluebird');

const options = {
  // Initialization Options
  promiseLib: pgPromise.promise,
  capSQL: true,
  error (err, e) {
    var date = new Date()
    // Exclude the big chunky query:
    console.log(JSON.stringify(err))
    var messageout = { 'error': JSON.stringify(err), 'query': e.query }
    console.log(date.toISOString() + ' ' + JSON.stringify(messageout))
  }
};

let pgp = pgPromise(options);

function dbheader () {
  var out = {
    'host': process.env.RDS_HOSTNAME,
    'user': process.env.RDS_USERNAME,
    'database': process.env.RDS_DATABASE,
    'password': process.env.RDS_PASSWORD,
    'port': process.env.RDS_PORT,
    'ssl': process.env.SSL_CERT, // Note, change this for AWS.
    'query_timeout': process.env.TIMEOUT,
    'application_name': 'OSPO API Server'
  }
  return pgp(out)
};

module.exports = { 'pgp': pgp, 'dbheader': dbheader }

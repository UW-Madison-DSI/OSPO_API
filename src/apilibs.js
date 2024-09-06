'use strict';
const path = require('path');
const assert = require('assert');
const promise = require('bluebird');

const options = {
    // Initialization Options
    promiseLib: promise,
    capSQL: true,
    query(e) {
      const date = new Date();
      let messageout = {'hasExecuted': e.client.hasExecuted};
      // Exclude the big chunky query:
      if (e.query.match(/CONCAT.*pronamespace = n.oid/)) {
        messageout.query = 'List all functions';
      } else if (e.query.match(/WHERE proname LIKE/)) {
        messageout.query = 'Match function schema';
      } else {
        messageout.query = e.query;
        messageout.db = {client: e.client.user,
          database: e.client.database,
          host: e.client.host};
      }
      console.log(date.toISOString() + ' ' + JSON.stringify(messageout));
    },
    error(err, e) {
      const date = new Date();
      // Exclude the big chunky query:
      console.log(JSON.stringify(err));
      let messageout = {'hasExecuted': e.client.hasExecuted,
        'error': JSON.stringify(err),
        'query': e.query};
      messageout.db = {'client': e.client.user,
        'database': e.client.database,
        'host': e.client.host};
      console.log(date.toISOString() + ' ' + JSON.stringify(messageout));
    },
  };
  
const pgp = require('pg-promise')(options);

function return404(obj) {
    return { 
        status: 'failure',
        message: 'The path you tried to use does not exist.',
        path: obj.originalUrl}
}

function return406(obj) {
    return { 
        status: 'failure',
        message: 'The path does not provide data in the requested format. Use only "application/json" in your content header.',
        requested: obj.header('accept') ?? 'none provided.' }
}

// Helper for linking to external query files:
/**
 * Take a SQL file and parse it into a pg-promise QueryFile object.
 * @param {string} file A valid filename for a SQL object.
 * @return {QueryFile} A pgp.QueryFile object for use in querying the database.
 */
function sql(file) {
    const fullPath = path.join(__dirname, file);
    return new pgp.QueryFile(fullPath, {
      minify: true,
    });
  }

/**
 * Get a parameter from either the URL query or body.
 * @param {req} req The Express request object.
 * @param {string} name The name of the parameter to be recovered.
 * @return {object}
 */
function getparam(req, name) {
    let result = {success: false, message: null, data: null};
  
    /**
     * Clear out any objects where the value for a key is undefined.
     * @param {object} obj The object to be cleaned
     * @return {object} The object with no undefined values.
     */
    function clean(obj) {
      const output = Object.keys(obj).filter(key => obj[key] !== undefined);
      return output;
    }
  
    const testquery = {body: clean(req.body),
      params: clean(req.params),
      query: clean(req.query),
    };
  
    // First ensure that there are no duplicate keys:
    const unstring = Object.values(testquery).flat();
  
    if (unstring.length !== [...new Set(unstring)].length) {
      result = {
        success: false,
        message: 'Duplicate keys present across params, query and body',
        data: null};
  
      return result;
    }
  
    // Then parse the body, parameters and the query:
    const output = {
      body: JSON.parse(JSON.stringify(req.body)),
      params: JSON.parse(JSON.stringify(req.params)),
      query: JSON.parse(JSON.stringify(req.query)),
    };
  
    // Finally, flatten the objects into a single object with all
    // key-value pairs.
    result = {
      success: true,
      message: null,
      data: Object.assign(output.body, output.params, output.query),
    };
  
    return result;
  }
  
/**
 * Quickly return value or null.
 * @param {string} x Any value passed in from an Express request object.
 * @param {string} opr An operation, one of either 'string',
 * 'sep', 'int' or 'float'.
* @return {any} Either the value of `x` or a `null` value.
 */
function ifUndef(x, opr) {
    if (typeof x === 'undefined') {
      return null;
    } else {
      switch (opr) {
        case 'string':
          return String(x);
        case 'sep':
          return commaSep(x);
        case 'int':
          return parseInt(x, 10);
        case 'float':
          return parseFloat(x);
      }
    }
  }
  
module.exports.return404 = return404;
module.exports.return406 = return406;
module.exports.sql = sql;
module.exports.getparam = getparam;
module.exports.ifUndef = ifUndef;
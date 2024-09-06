'use strict'

const express = require('express');
const router = express.Router();
const { return404, return406, sql, getparam, ifUndef } = require('../../src/apilibs')

let repos = [{name: "api_nodetest", url: "https://github.com/NeotomaDB/api_nodetest"}]

router.get('/repos/sources', function(req, res, next) {
    if (req.header('accept') != 'application/json') {
        res.status(406)
            .json(return406(req))
    } else {
        let db = req.app.locals.db
        db.any("SELECT * FROM ospoimportsources;")
            .then(function(data) {
                res.status(200)
                    .json(data)
            })
    }
})

router.get('/repos/stats/last_push', function(req, res, next) {
    let paramgrab = getparam(req)

    if (!paramgrab.success) {
        res.status(500)
            .json({
              status: 'failure',
              data: null,
              message: paramgrab.message,
            });
      } else {
        const resultset = paramgrab.data;
        let outobj = {
          'host': ifUndef(resultset.host, 'string'),
          };
        const repoquery = sql('./sql/repostats_last_push.sql')
        if (req.header('accept') != 'application/json') {
            res.status(406)
                .json(return406(req))
        } else {
            let db = req.app.locals.db
            db.any(repoquery, outobj)
                .then(function(data) {
                    res.status(200)
                        .json(data)
                })
        }
      }
})

router.get('/repos/stats/created', function(req, res, next) {
    let paramgrab = getparam(req)

    if (!paramgrab.success) {
        res.status(500)
            .json({
              status: 'failure',
              data: null,
              message: paramgrab.message,
            });
      } else {
        const resultset = paramgrab.data;
        let outobj = {
          'host': ifUndef(resultset.host, 'string'),
          };
        const repoquery = sql('./sql/repostats_created.sql')
        if (!req.header('accept').includes('application/json')) {
            res.status(406)
                .json(return406(req))
        } else {
            let db = req.app.locals.db
            db.any(repoquery, outobj)
                .then(function(data) {
                    console.log(data)
                    res.status(200)
                        .json(data)
                })
        }
      }
})

router.get('/repos', function(req, res, next) {
    let paramgrab = getparam(req)

    if (!paramgrab.success) {
        res.status(500)
            .json({
              status: 'failure',
              data: null,
              message: paramgrab.message,
            });
      } else {
        const resultset = paramgrab.data;
        let outobj = {
          'host': ifUndef(resultset.host, 'string'),
          };
        const repoquery = sql('./sql/repostats_last_push.sql')
        if (req.header('accept') != 'application/json') {
            res.status(406)
                .json(return406(req))
        } else {
            let db = req.app.locals.db
            db.any(repoquery, outobj)
                .then(function(data) {
                    res.status(200)
                        .json(data)
                })
        }
      }
})

router.get('/*', function(req, res, next) {
    res.status(404)
        .json(return404(req))
});
 
module.exports = router;

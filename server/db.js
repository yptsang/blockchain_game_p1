const mariadb = require('mariadb');
const config = require('./config')

const pool = mariadb.createPool({
    host: config.DATABASE_HOST,
    user: config.DATABASE_USER,
    password: config.DATABASE_PASSWORD,
    database: config.DATABASE_DB,
    connectionLimit: 5,
    allowPublicKeyRetrieval:true
});

const db_query = (queryObj) => new Promise((resolve, reject) => {
    if (!queryObj) reject("Please input queryObj{query:'sql query', param:[parameters]}");
    var { query, param } = queryObj;
    if (!query) reject("Please input queryObj.query");
    if (!param) param = null;
    pool.getConnection().then(conn => {
        conn.query(query, param).then((result) => {
            resolve(result);
            conn.end();
        }).catch(err => {
            reject(err);
            conn.end();
        })
    }).catch(err => {
        reject(err);
    });
})

exports.query = db_query;

// if you need pass the select result or processed data to next query, please set param "pass_data" in next query
exports.doTransaction = (q) => new Promise((resolve, reject) => {
    const querys = q;
    var results = [];

    // recursive function for step by step run all query
    function doNextQuery(index, conn, result) {
        // for pass data
        if (querys[index].param === "pass_data") {
            querys[index].param = result;
        }
        db_query(querys[index]).then(result => {
            index++;
            if (index < querys.length) {
                if (querys[index-1].process !== undefined && querys[index-1].process !== null) {  // for process data
                    querys[index-1].process(result).then(processed_data => {
                        results.push(processed_data);
                        doNextQuery(index, conn, processed_data)
                    })
                } else if (Array.isArray(result) && result[0]) {    // if result is array mean that is select query
                    values = Object.values(result[0]); // only support pass one row
                    results.push(result);
                    doNextQuery(index, conn, values)
                } else {
                    results.push(result);
                    doNextQuery(index, conn, null)
                }
            } else {
                // all query done
                conn.commit().then(() => {
                    conn.end();
                });
                resolve(results);
            }
        }).catch(err => {
            conn.rollback().then(() => {
                conn.end();
            });
            reject(err);
        })
    }

    pool.getConnection().then(conn => {
        conn.beginTransaction().then(() => {
            // start recursive
            doNextQuery(0, conn, null)
        }).catch(err => {
            reject(err);
            conn.end();
        })
    }).catch(err => {
        reject(err);
    });

})

var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
const db = require('../db')
var config = require('../config')
const multer = require('multer');
var XLSX = require('xlsx')
const { DateTime } = require("luxon");

// handle user upload xlsx
var upload = multer({
    storage: multer.memoryStorage({
        fileFilter(req, files, callback) {
            if (files.mimetype === 'application/xlsx') {
                cb(null, true);
            }
            cb(new Error('Please upload xlsx'))
        }
    })
});

// get seesion info by passcode
router.get('/session/passcode/:passcode', function (req, res, next) {
    const { passcode } = req.params; // need
    var session = {};
    db.query({
        query: "SELECT * FROM game1_sessions WHERE passcode=?",
        param: [passcode]
    }).then(result => {
        session.info = result[0];
        if (session.info && session.info.sid) {
            db.query({
                query: "SELECT * FROM game1_blocks WHERE sid=?",
                param: [session.info.sid]
            }).then(result => {
                session.blocks = result;
                res.json({ status: 0, session: session }); // return
            }).catch(err => {
                res.status(500).send(JSON.stringify(err));
            })
        } else {
            res.json({ status: 1, err: "session not found" });
        }
    }).catch(err => {
        res.status(500).send(JSON.stringify(err));
    })
});

// get seesion info by session id
router.get('/session/sid/:sid', function (req, res, next) {
    const { sid } = req.params; // need
    var session = {};
    db.query({
        query: "SELECT * FROM game1_sessions WHERE sid=?",
        param: [sid]
    }).then(result => {
        session.info = result[0];
        if (session.info && session.info.sid) {
            db.query({
                query: "SELECT * FROM game1_blocks WHERE sid=?",
                param: [sid]
            }).then(result => {
                session.blocks = result;
                res.json({ status: 0, session: session }); // return
            }).catch(err => {
                res.status(500).send(JSON.stringify(err));
            })
        } else {
            res.json({ status: 1, err: "session not found" });
        }
    }).catch(err => {
        res.status(500).send(JSON.stringify(err));
    })
});

// get seesion info by teacher id ( only 1 h )
router.get('/session/tid', function (req, res, next) {
    const { tid } = req.auth.decoded;
    var session = {};
    const date = DateTime.now().setZone('Asia/Hong_Kong');
    const dateJSObj = new Date(date.toISO().toString());
    const pTime = config.PASSCODE_EXPIRES_TIME * 60 + 1;
    db.query({
        query: "SELECT * FROM game1_sessions WHERE tid=? AND (TIMESTAMPDIFF(MINUTE, start_date, ?) < ?)",
        param: [tid, dateJSObj, pTime]
    }).then(result => {
        session.info = result[0];
        res.json({ status: 0, session: session }); // return
    }).catch(err => {
        res.status(500).send(JSON.stringify(err));
    })
});

// get block info
router.get('/session/:sid/block/:bid', function (req, res, next) {
    const { sid, bid } = req.params; // need
    db.query({
        query: "SELECT * FROM game1_blocks WHERE sid=? AND bid=?",
        param: [sid, bid]
    }).then(result => {
        res.json({ status: 0, block: result[0] }); // return
    }).catch(err => {
        res.status(500).send(JSON.stringify(err));
    })
});

// check private id
router.get('/session/sid/:sid/pid/:pid', function (req, res, next) {
    const { sid, pid } = req.params; // need
    db.query({
        query: "SELECT COUNT(*) AS count FROM game1_sessions WHERE sid=?, pid=?",
        param: [sid, pid]
    }).then(result => {
        if (result && result[0].count > 0) {
            res.json({ status: 0, msg: "ok" }); // return
        } else {
            res.json({ status: 1, err: "oof" });
        }
    }).catch(err => {
        res.status(500).send(JSON.stringify(err));
    })
});

// new game session
router.post('/session', upload.single('xlsx'), function (req, res, next) {
    const { tfbc, tfbm } = req.body; // need
    const { tid } = req.auth.decoded;
    const date = DateTime.now().setZone('Asia/Hong_Kong');
    const dateObj = date.toObject();
    const dateJSObj = new Date(date.toISO().toString());
    const passcode = `${dateObj.year + dateObj.month + dateObj.day}${dateObj.hour.toString().padStart(2, '0')}${dateObj.minute.toString().padStart(2, '0')}${dateObj.second.toString().padStart(2, '0')}${dateObj.millisecond.toString().substring(0, 1)}`;
    const pid = Math.floor(100000 + Math.random() * 900000);
    if (tid && tfbc && tfbm && req.file.buffer) {
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: true });
        const blocksArray = XLSX.utils.sheet_to_json(workbook.Sheets['blocks']);
        var session_id = 0;
        var q = "";
        if (blocksArray.length === 6) {
            q = `
                    INSERT INTO game1_blocks (bid, sid, cid, pdid, pdq, pdn, dd, nonce, ph, hash) 
                    VALUES 
                    (?,?,?,?,?,?,?,?,?,?),
                    (?,?,?,?,?,?,?,?,?,?),
                    (?,?,?,?,?,?,?,?,?,?),
                    (?,?,?,?,?,?,?,?,?,?),
                    (?,?,?,?,?,?,?,?,?,?),
                    (?,?,?,?,?,?,?,?,?,?)
                `
        } else if (blocksArray.length === 11) {
            q = `
                    INSERT INTO game1_blocks (bid, sid, cid, pdid, pdq, pdn, dd, nonce, ph, hash) 
                    VALUES 
                    (?,?,?,?,?,?,?,?,?,?),
                    (?,?,?,?,?,?,?,?,?,?),
                    (?,?,?,?,?,?,?,?,?,?),
                    (?,?,?,?,?,?,?,?,?,?),
                    (?,?,?,?,?,?,?,?,?,?),
                    (?,?,?,?,?,?,?,?,?,?),
                    (?,?,?,?,?,?,?,?,?,?),
                    (?,?,?,?,?,?,?,?,?,?),
                    (?,?,?,?,?,?,?,?,?,?),
                    (?,?,?,?,?,?,?,?,?,?),
                    (?,?,?,?,?,?,?,?,?,?)
                `
        } else {
            res.json({ status: 1, err: "Please make sure it has 5 / 10 ( Without Genesis Block ) Blocks in the excel sheets" });
            return;
        }
        querys = [
            {
                query: "INSERT INTO game1_sessions (passcode, tfbc, tfbm, tid, pid, game_end, start_date) VALUES (?,?,?,?,?,?,?)",
                param: [passcode, tfbc, tfbm, tid, pid, 0, dateJSObj]
            },
            {
                query: "SELECT * FROM game1_sessions WHERE passcode=?",
                param: [passcode],
                process: (result) => new Promise((resolve, reject) => {
                    const sid = result[0].sid;
                    session_id = sid;
                    var params = [];
                    blocksArray.map(block => {
                        if (block['Block'] !== 0) {
                            params.push(
                                block['Block'],
                                sid,
                                block['Customer ID'],
                                block['Product ID'],
                                block['Product Quantity'],
                                block['Product Name'],
                                new Date(block['Delivery Date']),
                                block['Nonce '],
                                block['Prev Hash (last 3 digits)'],
                                block['Hash']
                            )
                        } else {
                            params.push(
                                block['Block'],
                                sid,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                block['Hash']
                            )
                        }
                    });
                    resolve(params);
                })
            },
            {
                query: q,
                param: "pass_data"
            }
        ]
        db.doTransaction(querys).then(result => {
            res.json({ status: 0, passcode: passcode, pid: pid, sid: session_id }); // return
        }).catch(err => {
            res.status(500).send(JSON.stringify(err));
        })
    } else {
        res.json({ status: 1, err: "please post all data" });
    }
});

// new player
router.post('/session/miners', function (req, res, next) {
    const { pbid, sid } = req.auth.decoded;
    const pvid = Math.floor(100000 + Math.random() * 900000);
    if (pbid && sid) {
        db.query({
            query: "SELECT * FROM game1_miners WHERE pbid = ? AND sid = ?",
            param: [pbid, sid]
        }).then(result => {
            if (result[0]) {
                res.json({ status: 0, sid: sid, pvid: result[0].pvid }); // return
            } else {
                db.query({
                    query: "INSERT INTO game1_miners (pbid, pvid, sid, points) VALUES (?,?,?,?)",
                    param: [pbid, pvid, sid, 0]
                }).then(result => {
                    res.json({ status: 0, sid: sid, pvid: pvid }); // return
                }).catch(err => {
                    res.status(500).send(JSON.stringify(err));
                })
            }
        }).catch(err => {
            res.status(500).send(JSON.stringify(err));
        })
    } else {
        res.json({ status: 1, err: "u are not student" });
    }
});

// new answered block
router.post('/session/miners/blocks', function (req, res, next) {
    const { pbid, sid } = req.auth.decoded;
    const { bid, nonce, hash, pvid } = req.body; // need
    db.query({
        query: "SELECT COUNT(*) AS count FROM game1_miners WHERE sid=? AND pbid=? AND pvid=?",
        param: [sid, pbid, pvid]
    }).then(result => {
        if (result[0].count !== 0) {
            const date = DateTime.now().setZone('Asia/Hong_Kong');
            const dateJSObj = new Date(date.toISO().toString());
            if (pbid && sid && bid && nonce && hash) {
                db.query({
                    query: "SELECT * FROM game1_blocks WHERE sid=? AND bid=?",
                    param: [sid, bid]
                }).then(result => {
                    var corr = 0;
                    if (result[0].hash.toString() === hash.toString() && result[0].nonce.toString() === nonce.toString()) {
                        corr = 1;
                    }
                    db.query({
                        query: "INSERT INTO game1_miners_blocks (pbid, bid, nonce, hash, sid, votes, ad, correct) VALUES (?,?,?,?,?,?,?,?)",
                        param: [pbid, bid, nonce, hash, sid, 0, dateJSObj, corr]
                    }).then(result => {
                        res.json({ status: 0 }); // return
                    }).catch(err => {
                        console.log(err);
                        res.status(500).send(JSON.stringify(err));
                    })
                }).catch(err => {
                    res.status(500).send(JSON.stringify(err));
                })
            } else {
                res.json({ status: 1, err: "please post all data" });
            }
        } else {
            res.json({ status: 1, err: "Your Private ID is incorrect" });
        }
    }).catch(err => {
        res.status(500).send(JSON.stringify(err));
    })
});

// get miner's answered block
router.get('/session/miners/blocks', function (req, res, next) {
    const { pbid, sid } = req.auth.decoded;
    if (pbid && sid) {
        db.query({
            query: "SELECT * FROM game1_miners_blocks WHERE pbid=? AND sid=?",
            param: [pbid, sid]
        }).then(result => {
            res.json({ status: 0, blocks: result }); // return
        }).catch(err => {
            res.status(500).send(JSON.stringify(err));
        })
    } else {
        res.json({ status: 1, err: "Unauthorized" });
    }
});

// get miner's answered block with bid
router.get('/session/miners/blocks/:bid', function (req, res, next) {
    const { pbid, sid } = req.auth.decoded;
    const { bid } = req.params;
    if (pbid && sid) {
        db.query({
            query: "SELECT * FROM game1_miners_blocks WHERE pbid=? AND sid=? AND bid=?",
            param: [pbid, sid, bid]
        }).then(result => {
            res.json({ status: 0, block: result[0] }); // return
        }).catch(err => {
            res.status(500).send(JSON.stringify(err));
        })
    } else {
        res.json({ status: 1, err: "Unauthorized" });
    }
});

// get all miner answered block
router.get('/session/miners/blocks/all/:sid', function (req, res, next) {
    const { sid } = req.params;
    if (sid) {
        db.query({
            query: "SELECT * FROM game1_miners_blocks WHERE sid=?",
            param: [sid]
        }).then(result => {
            res.json({ status: 0, blocks: result }); // return
        }).catch(err => {
            res.status(500).send(JSON.stringify(err));
        })
    } else {
        res.json({ status: 1, err: "Unauthorized" });
    }
});

// get all miner answered block with bid
router.get('/session/:sid/miners/blocks/:bid', function (req, res, next) {
    const { sid, bid } = req.params;
    if (sid) {
        db.query({
            query: "SELECT * FROM game1_miners_blocks WHERE sid=? AND bid=?",
            param: [sid, bid]
        }).then(result => {
            res.json({ status: 0, blocks: result }); // return
        }).catch(err => {
            res.status(500).send(JSON.stringify(err));
        })
    } else {
        res.json({ status: 1, err: "Unauthorized" });
    }
});

// get miner answered block with bid and pbid
router.get('/session/:sid/miners/pbid/blocks/:bid', function (req, res, next) {
    const { sid, bid } = req.params;
    const { pbid } = req.auth.decoded;
    if (sid) {
        db.query({
            query: "SELECT COUNT(*) AS count FROM game1_miners_blocks WHERE sid=? AND bid=? AND pbid=?",
            param: [sid, bid, pbid]
        }).then(result => {
            res.json({ status: 0, count: result[0].count }); // return
        }).catch(err => {
            res.status(500).send(JSON.stringify(err));
        })
    } else {
        res.json({ status: 1, err: "Unauthorized" });
    }
});

// get all miner info
router.get('/session/:sid/miners', function (req, res, next) {
    const { sid } = req.params;
    if (sid) {
        db.query({
            query: "SELECT * FROM game1_miners WHERE sid=?",
            param: [sid]
        }).then(result => {
            res.json({ status: 0, miners: result }); // return
        }).catch(err => {
            res.status(500).send(JSON.stringify(err));
        })
    } else {
        res.json({ status: 1, err: "Unauthorized" });
    }
});

// get miner rank
router.get('/session/:sid/miners/rank', function (req, res, next) {
    const { sid } = req.params;
    if (sid) {
        db.query({
            query: "SELECT * FROM game1_miners WHERE sid=? AND points > 0 ORDER BY points DESC",
            param: [sid]
        }).then(result => {
            res.json({ status: 0, miners: result }); // return
        }).catch(err => {
            res.status(500).send(JSON.stringify(err));
        })
    } else {
        res.json({ status: 1, err: "Unauthorized" });
    }
});

// get miner count
router.get('/session/:sid/miners/count', function (req, res, next) {
    const { sid } = req.params;
    if (sid) {
        db.query({
            query: "SELECT COUNT(*) AS count FROM game1_miners WHERE sid=?",
            param: [sid]
        }).then(result => {
            res.json({ status: 0, count: result[0].count }); // return
        }).catch(err => {
            res.status(500).send(JSON.stringify(err));
        })
    } else {
        res.json({ status: 1, err: "Unauthorized" });
    }
});

// get all block's miner info
router.get('/session/:sid/blocks/:bid/miners/all', function (req, res, next) {
    const { sid, bid } = req.params;
    if (sid) {
        db.query({
            query: "SELECT * FROM game1_blocks_miners WHERE sid=? AND bid=?",
            param: [sid, bid]
        }).then(result => {
            res.json({ status: 0, miners: result }); // return
        }).catch(err => {
            res.status(500).send(JSON.stringify(err));
        })
    } else {
        res.json({ status: 1, err: "Unauthorized" });
    }
});

// check miner can mine block ( reject new miner mine old block )
router.get('/session/:sid/blocks/:bid/miners/check', function (req, res, next) {
    const { sid, bid } = req.params;
    const { pbid } = req.auth.decoded;
    if (sid && bid && pbid) {
        db.query({
            query: "SELECT COUNT(*) AS count FROM game1_blocks_miners WHERE sid=? AND bid=? AND pbid=?",
            param: [sid, bid, pbid]
        }).then(result => {
            res.json({ status: 0, count: result[0].count }); // return
        }).catch(err => {
            res.status(500).send(JSON.stringify(err));
        })
    } else {
        res.json({ status: 1, err: "Unauthorized" });
    }
});

// teacher force chained
router.put('/session/miners/blocks/force', function (req, res, next) {
    const { tid } = req.auth.decoded;
    const { sid, bid } = req.body;
    if (tid && bid && sid) {
        db.query({
            query: "UPDATE game1_blocks SET isChained=? WHERE sid=? AND bid=?",
            param: [2, sid, bid]
        }).then(result => {
            res.json({ status: 0 }); // return
        }).catch(err => {
            res.status(500).send(JSON.stringify(err));
        })
    } else {
        res.json({ status: 1, err: "Unauthorized" });
    }
});

// teacher new block
router.post('/session/:sid/blocks', function (req, res, next) {
    const { sid } = req.params;
    const { bid, pid } = req.body; // need
    if (sid, bid, pid) {
        db.query({
            query: "SELECT * FROM game1_sessions WHERE sid=?",
            param: [sid]
        }).then(result => {
            if (result[0].pid.toString() === pid.toString()) {
                db.query({
                    query: "SELECT * FROM game1_miners WHERE sid=?",
                    param: [sid]
                }).then(result => {
                    var promises = [];
                    result.map(miner => {
                        promises.push(
                            db.query({
                                query: "INSERT INTO game1_blocks_miners (sid, bid, pbid) VALUES (?,?,?)",
                                param: [sid, bid, miner.pbid]
                            })
                        )
                    })
                    Promise.all(promises).then(result_miners_counst => {
                        //res.json({ status: 0, miners_counst: result.length }); // return
                        const date = DateTime.now().setZone('Asia/Hong_Kong');
                        const dateJSObj = new Date(date.toISO().toString());
                        db.query({
                            query: "UPDATE game1_blocks SET cd=? WHERE sid=? AND bid=?",
                            param: [dateJSObj, sid, bid]
                        }).then(result => {
                            res.json({ status: 0, miners_counst: result_miners_counst }); // return
                        }).catch(err => {
                            res.status(500).send(JSON.stringify(err));
                        })
                    }).catch(err => {
                        res.status(500).send(JSON.stringify(err));
                    })
                }).catch(err => {
                    res.status(500).send(JSON.stringify(err));
                })
            } else {
                res.json({ status: 1, err: "Your Private ID is incorrect" }); // return
            }
        }).catch(err => {
            res.status(500).send(JSON.stringify(err));
        })
    } else {
        res.json({ status: 1, err: "Unauthorized" });
    }
});

// update votes
router.put('/session/blocks/votes', async function (req, res, next) {
    const { sid, bid } = req.body;
    if (!sid || !bid) {
        res.json({ status: 1, err: "Unauthorized" });
    } else {
        try {
            const block_info = await db.query({
                query: "SELECT * FROM game1_blocks WHERE sid=? AND bid=?",
                param: [sid, bid]
            })
            if (block_info[0].isChained === 0) {
                // clear vote
                await db.query({
                    query: "UPDATE game1_miners_blocks SET votes = 0 WHERE bid=?",
                    param: [bid]
                });
                // get all teacher upload block
                const blocks = await db.query({
                    query: "SELECT * FROM game1_blocks WHERE sid=? AND bid=?",
                    param: [sid, bid]
                });
                // get all miner answer block
                const miners_blocks = await db.query({
                    query: "SELECT * FROM game1_miners_blocks WHERE sid=? AND bid=?",
                    param: [sid, bid]
                });
                var promises = [];
                var correct_block_hash = 0;
                blocks.map(correct_block => {
                    correct_block_hash = correct_block.hash;
                    miners_blocks.map(miner_block => {
                        if (correct_block.hash === miner_block.hash) {
                            promises.push(db.query({
                                query: "UPDATE game1_miners_blocks SET votes = votes + 1 WHERE pbid=? AND bid=? AND sid=?",
                                param: [miner_block.pbid, miner_block.bid, miner_block.sid]
                            }))
                        }
                    })
                })
                await Promise.all(promises);
                promises = [];
                miners_blocks.map(miner_block => {
                    miners_blocks.map(other_miner_block => {
                        // only vote other miner
                        if (miner_block.pbid !== other_miner_block.pbid && miner_block.hash === other_miner_block.hash) {
                            promises.push(db.query({
                                query: "UPDATE game1_miners_blocks SET votes = votes + 1 WHERE pbid=? AND bid=? AND sid=?",
                                param: [other_miner_block.pbid, other_miner_block.bid, other_miner_block.sid]
                            }))
                        }
                    })
                })
                await Promise.all(promises);
                // check if vote > 51%
                const count_result = await db.query({
                    query: "SELECT COUNT(*) AS miners_count FROM game1_blocks_miners WHERE sid=? AND bid=?",
                    param: [sid, bid]
                })
                const { miners_count } = count_result[0];
                const updated_miners_blocks = await db.query({
                    query: "SELECT * FROM game1_miners_blocks WHERE sid=? AND bid=?",
                    param: [sid, bid]
                })
                var isOver = false;
                var vote_hash = "";
                updated_miners_blocks.map(block => {
                    // more than 51%
                    if ((block.votes / miners_count) >= 0.51 && correct_block_hash === block.hash) {
                        isOver = true;
                        vote_hash = block.hash;
                    }
                })
                // calculate points
                if (isOver) {
                    console.log("is over");
                    var n = Math.floor(miners_count / 2) + 1; // point
                    var seq = 1 // sequence;
                    const miners_blocks_asc = await db.query({
                        query: "SELECT * FROM game1_miners_blocks WHERE sid=? AND bid=? ORDER BY ad ASC",
                        param: [sid, bid]
                    });
                    promises = [];
                    miners_blocks_asc.map(block => {
                        if (block.hash === vote_hash && n >= 0) {
                            promises.push(db.query({
                                query: "UPDATE game1_miners_blocks SET points = ?, seq=? WHERE pbid=? AND bid=? AND sid=?",
                                param: [n, seq, block.pbid, block.bid, block.sid]
                            }));
                            promises.push(db.query({
                                query: "UPDATE game1_miners SET points = points + ? WHERE pbid=? AND sid=?",
                                param: [n, block.pbid, block.sid]
                            }));
                            n--;
                            seq++;
                        }
                    });
                    await Promise.all(promises);
                    db.query({
                        query: "UPDATE game1_blocks SET isChained = 1 WHERE bid=? AND sid=?",
                        param: [bid, sid]
                    })
                    res.json({ status: 0, isOver: 1, msg: "is_over" });
                    console.log("end of block");
                } else {
                    res.json({ status: 0, isOver: 0, msg: "not_over" });
                }
            } else {
                res.json({ status: 1, err: "session is over" });
            }
        } catch (err) {
            console.log(err);
            res.status(500).send(JSON.stringify(err));
        }
    }
});

module.exports = router;

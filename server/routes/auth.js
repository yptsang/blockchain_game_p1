var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
const db = require('../db')
var config = require('../config')
const { v4: uuidv4 } = require('uuid');
const { DateTime } = require("luxon");
let socket = require("../socket");

// refresh token
router.get('/', function (req, res, next) {
    let token = req.headers.authorization
    jwt.verify(token, config.JWT_SECRET_KEY, function (err, decoded) {
        if (err) {
            res.status(401).json({ status: 1, message: 'Unauthorized!' });
        } else {
            const uuid = uuidv4();
            const { tid, pbid, sid } = decoded;
            var token;
            if (tid) {
                token = jwt.sign({ tid, uuid }, config.JWT_SECRET_KEY, { expiresIn: config.JWT_EXPIRES_TIME });
            } else if (pbid && sid) {
                token = jwt.sign({ pbid, sid, uuid }, config.JWT_SECRET_KEY, { expiresIn: config.JWT_EXPIRES_TIME });
            } else {
                res.json({ status: 1, err: "How???" });
                return;
            }
            res.json({ status: 0, token: token });
        }
    });
});

// new teacher token
router.post('/teacher', function (req, res, next) {
    try {
        var sockets = [];
        socket.io.fetchSockets().then(result => {
            console.log("all socket id: ");
            result.map(s => {
                console.log(s.id);
                sockets.push(s.id);
            })
        })
        const { tid, pw } = req.body;
        if (tid && pw) {
            db.query({
                query: "SELECT * FROM teachers WHERE tid=? AND pwd=?",
                param: [tid, pw]
            }).then(result => {
                if (result[0]) {
                    if (result[0].socket_id === "0") {
                        const uuid = uuidv4();
                        const token = jwt.sign({ tid, uuid }, config.JWT_SECRET_KEY, { expiresIn: config.JWT_EXPIRES_TIME });
                        res.json({ status: 0, token: token });
                    } else if (!sockets.find(id => id === result[0].socket_id)) {
                        const uuid = uuidv4();
                        const token = jwt.sign({ tid, uuid }, config.JWT_SECRET_KEY, { expiresIn: config.JWT_EXPIRES_TIME });
                        res.json({ status: 0, token: token });
                    } else {
                        res.json({ status: 1, err: "Account is already logged in" });
                    }
                } else {
                    res.json({ status: 1, err: "Account not found" });
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send(JSON.stringify(err));
            })
        } else {
            res.status(500).json({ error: "Please post teacher id and pw!" });
        }
    } catch (error) {
        console.log(error);
    }

});

// new student token
router.post('/student', function (req, res, next) {
    try {
        var sockets = [];
        socket.io.fetchSockets().then(result => {
            console.log("all socket id: ");
            result.map(s => {
                console.log(s.id);
                sockets.push(s.id);
            })
        })
        const { pbid, passcode } = req.body;
        if (pbid && passcode) {
            const date = DateTime.now().setZone('Asia/Hong_Kong');
            const dateJSObj = new Date(date.toISO().toString());
            const pTime = config.PASSCODE_EXPIRES_TIME * 60 + 1;
            db.query({
                query: "SELECT sid FROM game1_sessions WHERE passcode=? AND (TIMESTAMPDIFF(MINUTE, start_date, ?) < ?)",
                param: [passcode, dateJSObj, pTime]
            }).then(result => {
                if (result[0]) {
                    db.query({
                        query: "SELECT * FROM game1_miners WHERE pbid=? AND sid=?",
                        param: [pbid, result[0].sid]
                    }).then(result2 => {
                        if (!result2[0]) {
                            const uuid = uuidv4();
                            const sid = result[0].sid;
                            const token = jwt.sign({ pbid, sid, uuid }, config.JWT_SECRET_KEY, { expiresIn: config.JWT_EXPIRES_TIME });
                            res.json({ status: 0, token: token, sid: sid });
                        } else if (result2[0].socket_id === "0") {
                            const uuid = uuidv4();
                            const sid = result[0].sid;
                            const token = jwt.sign({ pbid, sid, uuid }, config.JWT_SECRET_KEY, { expiresIn: config.JWT_EXPIRES_TIME });
                            res.json({ status: 0, token: token, sid: sid, re: 1 });
                        } else if (!sockets.find(id => id === result2[0].socket_id)) {
                            const uuid = uuidv4();
                            const sid = result[0].sid;
                            const token = jwt.sign({ pbid, sid, uuid }, config.JWT_SECRET_KEY, { expiresIn: config.JWT_EXPIRES_TIME });
                            res.json({ status: 0, token: token, sid: sid, re: 1 });
                        } else {
                            res.json({ status: 1, err: "Account is already logged in" });
                        }
                    }).catch(err => {
                        res.status(500).send(JSON.stringify(err));
                        console.log(err);
                    })
                } else {
                    res.json({ status: 1, err: "Passcode not found" });
                }
            }).catch(err => {
                res.status(500).send(JSON.stringify(err));
                console.log(err);
            })
        } else {
            res.status(500).json({ error: "Please post public id and passcode!" });
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;

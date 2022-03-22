const db = require('./db')

const io = require("socket.io")();
const socket = {
    io: io
};

io.on("connection", function (socket) {
    socket.onAny((eventName, ...args) => {
        const { sid } = args;
        if (sid) {
            console.log(eventName, socket.id, socket.rooms, sid, io.of("/").adapter.rooms);
        } else if (args) {
            console.log(eventName, socket.id, socket.rooms, args, io.of("/").adapter.rooms);
        } else {
            console.log(eventName, socket.id, socket.rooms);
        }
    });
    socket.on("disconnect", (reason) => {
        console.log(socket.id + " disconnect " + reason);
        db.query({
            query: "UPDATE teachers SET socket_id = 0 WHERE socket_id = ?",
            param: [socket.id]
        }).then(result => {
        }).catch(err => {
            console.log(socket.id + " disconnect err " + err);
        })
        db.query({
            query: "UPDATE game1_miners SET socket_id = 0 WHERE socket_id = ?",
            param: [socket.id]
        }).then(result => {
        }).catch(err => {
            console.log(socket.id + " disconnect err " + err);
        })
    });
    socket.on("deactivate", (reason) => {
        console.log(socket.id + " deactivate " + reason);
        db.query({
            query: "UPDATE teachers SET socket_id = 0 WHERE socket_id = ?",
            param: [socket.id]
        }).then(result => {
        }).catch(err => {
            console.log(socket.id + " deactivate err " + err);
        })
        db.query({
            query: "UPDATE game1_miners SET socket_id = 0 WHERE socket_id = ?",
            param: [socket.id]
        }).then(result => {
        }).catch(err => {
            console.log(socket.id + " deactivate err " + err);
        })
    });
    socket.on("activate_game1", args => {
        const { type, id, sid } = args;
        if (type === "Teacher") {
            db.query({
                query: "UPDATE teachers SET socket_id = ? WHERE tid = ?",
                param: [socket.id, id]
            }).then(result => {
                console.log(socket.id + " activate " + id);
            }).catch(err => {
                console.log(socket.id + " activate err " + err);
            })
        } else if (type === "Student") {
            db.query({
                query: "UPDATE game1_miners SET socket_id = ? WHERE sid = ? AND pbid = ?",
                param: [socket.id, sid, id]
            }).then(result => {
                console.log(socket.id + " activate " + id);
            }).catch(err => {
                console.log(socket.id + " activate err " + err);
            })
        }
    });
    // join game1 session
    socket.on("join_game1", sid => {
        console.log(socket.id + " join_game1 " + sid);
        socket.join(sid.toString());
        io.to(sid.toString()).emit("new_people_join");
    });
    socket.on("teacher_update_game1_block", sid => {
        console.log(socket.id + " teacher_update_game1_block " + sid);
        io.to(sid.toString()).emit("game1_block_update");
    });
    socket.on("teacher_force_chained", sid => {
        console.log(socket.id + " teacher_update_game1_block " + sid);
        io.to(sid.toString()).emit("game1_block_force_chained");
    });
    socket.on("leaveSession", sid => {
        if (sid) {
            console.log(socket.id + " leaveSession " + sid);
            socket.leave(sid.toString());
        }
    });
    // update game1 points and votes
    socket.on("update_game1_votes", async (args) => {
        const { sid, bid } = args;
        if (!sid || !bid) {
            console.log("fml");
            return;
        }
        io.to(sid.toString()).emit("game1_votes_update");
        const block_info = await db.query({
            query: "SELECT * FROM game1_blocks WHERE sid=? AND bid=?",
            param: [sid, bid]
        })
        if (block_info[0].isChained !== 0) {
            io.to(sid.toString()).emit("game1_block_end");
        }
    });

}); // end of socket.io logic

module.exports = socket;
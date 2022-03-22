import React, { useEffect, useContext, useState } from 'react';
import TitleBar from '../../comonents/TitleBar';
import Tables from '../../comonents/Table/index';
import Timer from '../../comonents/Timer';
import './index.css'
import { useNavigate } from 'react-router-dom'
import { Context } from '../../context/Context'
import { EXPRESS_SERVER_URL } from "../../config";
import axios from '../../axios'

export default function MinerDashboardPage() {

    const navigate = useNavigate();

    const { gameOver, setGameOver, sessionID, socket, sessionInfo, setSessionInfo, setTimerSeconds, setTimerStart, setBlockDetail } = useContext(Context);
    const [response, setResponse] = useState([])

    const getBlocks = async () => {
        try {

            setBlockDetail({});

            const result = await axios(`${EXPRESS_SERVER_URL}/game1/session/sid/${sessionID}`, { method: 'GET' })
            const json = await result.data

            if (json.status === 0) {
                setGameOver(false);
                console.log("get blocks");
                setResponse({ table_type: 'table_col_4_button', head: ["Block Index", "Data", "Timestamp", "Status"], body: json.session.blocks })
                setSessionInfo(json.session.info)
                // setTimerSeconds(json.session.info.tfbc * 60)
                setTimerStart(false);
                setTimerSeconds(0);
                var chainedBlockCount = 0;
                for (var i = 0; i < json.session.blocks.length; i++) {
                    if (json.session.blocks[i].cd !== null) {
                        if (json.session.blocks[i].isChained === 1 || json.session.blocks[i].isChained === 2) {
                            chainedBlockCount++;
                        } else {
                            const createDate = new Date(json.session.blocks[i].cd);
                            createDate.setSeconds(createDate.getSeconds() + json.session.info.tfbc * 60);
                            var between = (createDate.getTime() - new Date().getTime()) / 1000;
                            setTimerSeconds(Math.floor(between))
                            setTimerStart(true);
                        }
                    }
                }
                if (chainedBlockCount === json.session.blocks.length - 1) {
                    setGameOver(true);
                    setTimerStart(false);
                    setTimerSeconds(0);
                }
            } else {
                console.log(json.err);
            }

        } catch (e) {
            console.log(e)
        }
    }


    useEffect(() => {
        getBlocks();
        const game1_block_update_listener = (message) => {
            console.log("game1_block_update_listener");
            getBlocks();
        };
        const game1_block_end_listener = (message) => {
            console.log("game1_block_end");
            navigate('/hashboardwaiting');
        };
        const teacher_force_chained_listener = (message) => {
            console.log("teacher_force_chained");
            navigate('/hashboardwaiting');
        };
        socket.on("game1_block_end", game1_block_end_listener);
        socket.on("game1_block_force_chained", teacher_force_chained_listener);
        socket.on("game1_block_update", game1_block_update_listener);
        return () => {
            socket.off("game1_block_end", game1_block_end_listener);
            socket.off("game1_block_force_chained", teacher_force_chained_listener);
            socket.off("game1_block_update", game1_block_update_listener);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <main>
            <TitleBar backLastPage="" lastPageName="minerhome" />
            <br />
            <div className='MinerDashboard_titlebox'>
                <div className='MinerDashboard_titlebox_topic'>Real-time dashboard</div>
                <div className='MinerDashboard_titletimebox'><Timer /></div>
            </div>
            <br />
            <div className='MinerDashboardPage_mainTable' style={{
                height: "600px", overflow: 'scroll'
            }}>
                <Tables json={response} />
            </div>
            <br />
            <input type="button" value="All Blocks are created and mined ( Browse Miners Points )" style={gameOver ? { width: "100%", display: "inline", backgroundColor: "lightgreen" } : { display: "none", backgroundColor: "lightgreen" }} onClick={() => { navigate('/point') }} />
            <br />
            {/* <input type="button" value="Logout" style={gameOver ? { width: "100%", display: "inline", backgroundColor: "lightgreen" } : { display: "none", backgroundColor: "lightgreen" }} onClick={() => { navigate('/login') }} /> */}
            <br />
        </main>
    )
}
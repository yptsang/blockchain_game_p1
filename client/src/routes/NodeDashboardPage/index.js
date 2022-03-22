import React, { useEffect, useContext, useState } from 'react';
import './index.css'
import Tables from '../../comonents/Table/index';
import TitleBar from '../../comonents/TitleBar';
import { useNavigate } from 'react-router-dom'
import { Context } from '../../context/Context'
import { EXPRESS_SERVER_URL } from "../../config";
import axios from '../../axios'
import Timer from '../../comonents/Timer'

export default function NodeDashboardPage() {
    // const json = { table_type: "table_col_4" , head: ["Block Index", "Data", "Timestamp", "Status"], body: [{ x: 1, x2: 2, x3: 3, x4: 2 }, { x: 1, x2: 2, x3: 3, x4: 3 }, { x: 1, x2: 2, x3: 3, x4: 3 }, { x: 1, x2: 2, x3: 3, x4: 3 }, { x: 1, x2: 2, x3: 3, x4: 3 }, { x: 1, x2: 2, x3: 3, x4: 3 }, { x: 1, x2: 2, x3: 3, x4: 3 }, { x: 1, x2: 2, x3: 3, x4: 3 }, { x: 1, x2: 2, x3: 3, x4: 3 }, { x: 1, x2: 2, x3: 3, x4: 3 }] }
    // const json = { table_type: 'table_col_5_button', head: ["Block Index", "Data", "Timestamp", "Status", "Status"], body: [{ td1: 1, td2: 2, td3: 3, td4: 3, td5: {p:49 ,v:true } },{ td1: 1, td2: 2, td3: 3, td4: 3, td5: {p:1,v:false } },{ td1: 1, td2: 2, td3: 3, td4: 3, td5: {p:49 ,v:true } },{ td1: 1, td2: 2, td3: 3, td4: 3, td5: {p:1,v:false } },{ td1: 1, td2: 2, td3: 3, td4: 3, td5: {p:49 ,v:true } },{ td1: 1, td2: 2, td3: 3, td4: 3, td5: {p:1,v:false } }] }
    // const jsonsty = { table_type: 'table_col_5_button', head: ["Block Index", "Data", "Timestamp", "Status"], body: [{ td1: 1, td2: 2, td3: 3, td4: 51,td5: {p:49 ,v:true },style:"red" },{ td1: 1, td2: 2, td3: 3, td4: 51,td5: {p:49 ,v:true },style:"null" } ] }



    // const data = [
    //     { name: 'Group A', value: 400 },
    //     { name: 'Group B', value: 300 },
    // ];
    // const json = { table_type: 'table_barchat', head: ["Block Index", "Data", "Timestamp", "Status", "Status"], body: [{ td1: 1, td2: 2, td3: 3, td4: 51, td5: { data: data, num: '12/31' } }, { td1: 1, td2: 2, td3: 3, td4: 51, td5: { data: data, num: '12/31' } }] }


    const navigate = useNavigate();

    const { gameOver, setGameOver, sessionID, socket, sessionInfo, setSessionInfo, setTimerStart, setTimerSeconds } = useContext(Context);
    const [response, setResponse] = useState([]);
    const [allowCreateBlock, setAllowCreateBlock] = useState(false);
    const [minerCount, setMinerCount] = useState(0);

    const getBlocks = async () => {
        try {

            const result = await axios(`${EXPRESS_SERVER_URL}/game1/session/sid/${sessionID}`, { method: 'GET' })
            const json = await result.data

            if (json.status === 0) {
                setGameOver(false);
                setResponse({ table_type: 'table_col_4_button', head: ["Block Index", "Data", "Timestamp", "Status"], body: json.session.blocks })
                setSessionInfo(json.session.info)
                // setTimerSeconds(json.session.info.tfbc * 60)
                setTimerStart(false);
                setTimerSeconds(0);
                var createdBlockCount = 0;
                var chainedBlockCount = 0;
                for (var i = 0; i < json.session.blocks.length; i++) {
                    if (json.session.blocks[i].cd !== null) {
                        createdBlockCount++;
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
                if (createdBlockCount === chainedBlockCount) {
                    setAllowCreateBlock(true);
                }
                if (chainedBlockCount === json.session.blocks.length - 1) {
                    setAllowCreateBlock(false);
                    setGameOver(true);
                    setTimerStart(false);
                    setTimerSeconds(0);
                }
            }


        } catch (e) {
            console.log(e)
        }
    }

    const getMinerCount = async () => {
        try {
            const miner_count_result = await axios(`${EXPRESS_SERVER_URL}/game1/session/${sessionID}/miners/count`, { method: 'GET' });
            const miner_count = await miner_count_result.data;

            if (miner_count.status === 0) {
                setMinerCount(miner_count.count);
            }
        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        getBlocks();
        getMinerCount();
        const game1_block_end_listener = (message) => {
            console.log("game1_block_end_listener");
            getBlocks();
        };
        const new_people_join_listener = (message) => {
            console.log("new_people_join");
            getMinerCount();
        };
        socket.on("game1_block_end", game1_block_end_listener);
        socket.on("new_people_join", new_people_join_listener);
        return () => {
            socket.off("game1_block_end", game1_block_end_listener);
            socket.off("new_people_join", new_people_join_listener);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // const handle_response = () => {

    // }

    return (
        <main>
            <TitleBar backLastPage="" lastPageName="nodehome" />
            <br />
            <div className='NodeDashboard_titlebox'>
                <div>Real-time dashboard</div>
                <div className='NodeDashboard_titlebox_right'>
                    <div className='NodeDashboard_titletimebox_top'><Timer /></div>
                    <div className='NodeDashboard_titletimebox_down'>{minerCount} Miners</div>
                </div>
            </div>
            <div className='NodeDashboard_mainTable' style={{
                height: "600px", overflow: 'scroll'
            }}>
                <Tables json={response} sessionInfo={sessionInfo} />
            </div>
            <br />
            <div className='NodeDashboard_submit_div'>
                <input className="NodeDashboard_submit_btn" type="button" value="New Wine Transaction" disabled={!allowCreateBlock} style={!gameOver ? !allowCreateBlock ? { backgroundColor: "rgba(213, 213, 213, 0.8)", color: "rgba(152, 152, 152, 0.8)" } : null : { display: "none" }} onClick={() => navigate('/dataupload')} />
                <input className="NodeDashboard_submit_btn" type="button" value="All Blocks are created and mined ( Browse Miners Points )" style={gameOver ? { display: "inline", backgroundColor: "lightgreen" } : { display: "none", backgroundColor: "lightgreen" }} onClick={() => { navigate('/point') }} />
                <br />
                {/* <input className="NodeDashboard_submit_btn" type="button" value="Logout" style={gameOver ? { display: "inline", backgroundColor: "lightgreen" } : { display: "none", backgroundColor: "lightgreen" }} onClick={() => { navigate('/login') }} /> */}
            </div>
            <br />
        </main>
    )
}
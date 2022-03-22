import React, { useContext, useState, useEffect } from 'react';
import TitleBar from '../../comonents/TitleBar';
import Tables from '../../comonents/Table/index';
import './index.css'
import { useNavigate } from 'react-router-dom'
import { EXPRESS_SERVER_URL } from "../../config";
import axios from '../../axios'
import { Context } from '../../context/Context'



export default function VerificationPage() {

    const navigate = useNavigate();

    const { sessionID, socket, blockDetail } = useContext(Context);
    const [response, setResponse] = useState([])
    const [total, setTotal] = useState(0)

    const getBlocks = async () => {
        try {

            const m_result = await axios(`${EXPRESS_SERVER_URL}/game1/session/${sessionID}/blocks/${blockDetail.bid}/miners/all`, { method: 'GET' })
            const m_json = await m_result.data

            if (m_json.status === 0) {
                setTotal(m_json.miners.length);
            }

            const result = await axios(`${EXPRESS_SERVER_URL}/game1/session/${sessionID}/miners/blocks/${blockDetail.bid}`, { method: 'GET' })
            const json = await result.data

            if (json.status === 0) {
                setResponse(json.blocks)
            } else {
                console.log(json.err);
            }

        } catch (e) {
            console.log(e)
        }
    }


    const forceChained = async () => {
        try {

            const result = await axios(`${EXPRESS_SERVER_URL}/game1/session/miners/blocks/force`, {
                method: 'PUT',
                data: { sid: sessionID, bid: blockDetail.bid }
            })
            const json = await result.data

            if (json.status === 0) {
                socket.emit("teacher_force_chained", sessionID);
                navigate(-1);
            } else {
                console.log(json.err);
            }

        } catch (e) {
            console.log(e)
        }
    }

    const json = { table_type: 'table_col_5_button', head: ["Timestamp", "Public ID", "Nonce", "Hash Value", "Verification"], body: response }

    useEffect(() => {
        getBlocks();
        const game1_votes_update_listener = (message) => {
            console.log("game1_votes_update_listener");
            getBlocks();
        };
        socket.on("game1_votes_update", game1_votes_update_listener);
        return () => socket.off("game1_votes_update", game1_votes_update_listener);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <main>
            <TitleBar backLastPage="" lastPageName="" />
            <br />
            <div className='VerificationPage_topicBox'>
                <div>Verification:</div>
                <div>The Hash Value is divided by 3 and 7.</div>
                <div>(condition)</div>
            </div>
            <br />
            <div className='VerificationPage_titlebox'>
                <div className='VerificationPage_title_font'>Hash-board</div>
                <div>
                    <input type="button" value="Force Chained" className='VerificationPage_title_btn' onClick={forceChained} />
                </div>
            </div>
            <br />
            <div className='VerificationPage_mainTable' style={{
                height: "600px", overflow: 'scroll'
            }}>
                <Tables json={json} total={total} />
            </div>
            <br />
            <div className='VerificationPage_back_div'>
                <input className="VerificationPage_back_btn" type="button" value="Back" onClick={() => navigate(-1)} />
            </div>
            <br />
        </main>
    )
}
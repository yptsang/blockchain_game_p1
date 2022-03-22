import React, { useEffect, useContext, useState } from 'react';
import TitleBar from '../../comonents/TitleBar';
import Tables from '../../comonents/Table/index';
import './index.css'
import { Context } from '../../context/Context'
import { EXPRESS_SERVER_URL } from "../../config";
import axios from '../../axios'
import PointsMessageModal from '../../comonents/PointsMessageModal';

export default function HashBoardWaitingPage() {

    const { sessionID, socket, sessionInfo, setSessionInfo, blockDetail } = useContext(Context);
    const [response, setResponse] = useState([]);
    const [showPointsMessageModalModal, setShowPointsMessageModalModal] = useState(false);
    const [sequencNo, setSequencNo] = useState(0);
    const [point, setPoint] = useState(0);
    const [total, setTotal] = useState(0);

    const getBlocks = async () => {
        try {

            if (!blockDetail.bid) {
                showPointModal();
                return;
            }

            const b_result = await axios(`${EXPRESS_SERVER_URL}/game1/session/${sessionID}/block/${blockDetail.bid}`, { method: 'GET' })
            const b_json = await b_result.data

            if (b_json.status === 0 && b_json.block.isChained !== 0) {
                showPointModal();
                return;
            }

            const m_result = await axios(`${EXPRESS_SERVER_URL}/game1/session/${sessionID}/blocks/${blockDetail.bid}/miners/all`, { method: 'GET' })
            const m_json = await m_result.data

            if (m_json.status === 0) {
                setTotal(m_json.miners.length);
            }

            const result = await axios(`${EXPRESS_SERVER_URL}/game1/session/${sessionID}/miners/blocks/${blockDetail.bid}`, { method: 'GET' })
            const json = await result.data

            if (json.status === 0) {
                setResponse({ table_type: "table_barchat", title: "Hash-board", head: ["Timestamp", "Public ID", "Nonce", "Hash Value", "Vote"], body: json.blocks })
                setSessionInfo(json.session.info)
            }

        } catch (e) {
            console.log(e)
        }
    }

    const showPointModal = async () => {
        try {

            if (!blockDetail.bid) {
                setSequencNo(0);
                setPoint(0);
                setShowPointsMessageModalModal(true);
                return;
            }

            const result = await axios(`${EXPRESS_SERVER_URL}/game1/session/miners/blocks/${blockDetail.bid}`, { method: 'GET' })
            const json = await result.data

            if (json.status === 0 && json.block) {
                setSequencNo(json.block.seq);
                setPoint(json.block.points);
            }
            setShowPointsMessageModalModal(true);

        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getBlocks();
        const game1_block_end_listener = (message) => {
            console.log("game1_block_end");
            showPointModal();
        };
        const teacher_force_chained_listener = (message) => {
            console.log("teacher_force_chained");
            showPointModal();
        };
        const game1_votes_update_listener = (message) => {
            console.log("game1_votes_update");
            getBlocks();
        };
        socket.on("game1_block_end", game1_block_end_listener);
        socket.on("game1_votes_update", game1_votes_update_listener);
        socket.on("game1_block_force_chained", teacher_force_chained_listener);
        return () => {
            socket.off("game1_block_end", game1_block_end_listener);
            socket.off("game1_votes_update", game1_votes_update_listener);
            socket.off("game1_block_force_chained", teacher_force_chained_listener);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <main>
            <TitleBar backLastPage="" lastPageName="" />
            <br />
            <div className='HashBoardWaitingPage_title'>Hash-board</div>
            <br />
            <div className='HashBoardWaitingPage_mainTable'>
                <Tables json={response} total={total} />
            </div>
            <div className='HashBoardWaitingPage_waiting_div'>
                <input className="HashBoardWaitingPage_waiting_btn" type="button" value="Waiting for the result ..." />
            </div>
            <br />
            <PointsMessageModal showPointsMessageModalModal={showPointsMessageModalModal} sequencNo={sequencNo} point={point} />
        </main>
    )
}
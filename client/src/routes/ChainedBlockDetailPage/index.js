import React, { useContext, useState, useEffect } from 'react';
import TitleBar from '../../comonents/TitleBar';
import './index.css'
import { EXPRESS_SERVER_URL } from "../../config";
import { useNavigate } from 'react-router-dom'
import { Context } from '../../context/Context'
import axios from '../../axios'

export default function ChainedBlockDetailPage() {

    const navigate = useNavigate();

    const { blockDetail, sessionID } = useContext(Context);

    const [block, setBlock] = useState(null);

    const getBlockCorrectHash = async () => {
        const result = await axios(`${EXPRESS_SERVER_URL}/game1/session/sid/${sessionID}`, { method: 'GET' })
        const json = await result.data
        if (json.status === 0) {
            setBlock(json.session.blocks[blockDetail.bid]);
        }
    }

    useEffect(() => {
        getBlockCorrectHash();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <main>
            <TitleBar backLastPage="" lastPageName="" />
            <br /><br />
            <div className='ChainedBlockDetailPage_main'>
                <div>Detail of the Chained Block</div><br />
                <div className='ChainedBlockDetailPage_HashBox'>
                    <div className='ChainedBlockDetailPage_HashBox_left'>Block Index</div>
                    <div className='ChainedBlockDetailPage_HashBox_right'>: {block ? block.bid : null}</div>
                </div>
                <br />
                <div className='ChainedBlockDetailPage_HashBox'>
                    <div className='ChainedBlockDetailPage_HashBox_left'>Hash Value</div>
                    <div className='ChainedBlockDetailPage_HashBox_right'>: {block ? block.hash : null}</div>
                </div>
                <br />
                <div className='ChainedBlockDetailPage_HashBox'>
                    <div className='ChainedBlockDetailPage_HashBox_left'>Nonce Value</div>
                    <div className='ChainedBlockDetailPage_HashBox_right'>: {block ? block.nonce : null}</div>
                </div>
                <br />
            </div>
            <div className='ChainedBlockDetailPage_submit_div'>
                <input className="ChainedBlockDetailPage_submit_btn" type="button" value="Back" onClick={() => navigate(-1)} />
            </div>
            <br />
        </main>
    )
}
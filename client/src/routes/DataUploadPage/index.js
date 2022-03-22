import React, { useState, useContext, useEffect, useRef } from 'react';
import { Form, } from 'react-bootstrap';
import TitleBar from '../../comonents/TitleBar';
import CustomerDemands from '../../comonents/CustomerDemands';
import './index.css'
import { Context } from '../../context/Context'
import axios from '../../axios'
import ErrorModal from '../../comonents/ErrorModal';
import { EXPRESS_SERVER_URL, MIN_MINER_COUNT } from "../../config";
import { useNavigate } from 'react-router-dom'

export default function NodeUploadPage() {
    const { sessionID, socket } = useContext(Context);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [blocks, setBlocks] = useState(null);
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [inputedPrivateID, setInputedPrivateID] = useState("");
    const [errorMSG, setErrorMSG] = useState('');
    const container = useRef(null)

    const navigate = useNavigate();

    useEffect(() => {
        getBlocks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        container.current.scrollTop = (selectedBlock-1)*140
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBlock])

    const getBlocks = async () => {
        try {
            const result = await axios(`${EXPRESS_SERVER_URL}/game1/session/sid/${sessionID}`, { method: 'GET' })
            const json = await result.data;
            if (json.status === 0) {
                setBlocks(json.session.blocks);
                for (var i = 1; i < json.session.blocks.length; i++) {
                    console.log(json.session.blocks[i]);
                    if (json.session.blocks[i].cd === null) {
                        setSelectedBlock(json.session.blocks[i].bid);
                        break;
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    const publicBlock = async () => {
        if (selectedBlock && inputedPrivateID) {
            try {
                const miner_count_result = await axios(`${EXPRESS_SERVER_URL}/game1/session/${sessionID}/miners/count`, { method: 'GET' });
                const miner_count = await miner_count_result.data;
                if (!miner_count || miner_count.status !== 0 || miner_count.count < MIN_MINER_COUNT) {
                    console.log("Not enough miners (at least " + MIN_MINER_COUNT + " miners) to start the game or other error occurs");
                    showErrorModelFunction("Not enough miners (at least " + MIN_MINER_COUNT + " miners) to start the game or other error occurs");
                    return;
                }
                const result = await axios(`${EXPRESS_SERVER_URL}/game1/session/${sessionID}/blocks`, {
                    method: 'POST',
                    data: { bid: selectedBlock, pid: inputedPrivateID }
                })
                const json = await result.data;
                if (json.status === 0) {
                    navigate('/nodedashboard');
                    socket.emit("teacher_update_game1_block", sessionID);
                } else {
                    console.log(json.err);
                    if(json.err === "Your Private ID is incorrect"){
                        showErrorModelFunction("Your Private ID is incorrect!")
                    }else{
                        showErrorModelFunction(json.err)
                    }
                }
            } catch (err) {
                console.log(err);
                showErrorModelFunction('Error: '+err.message)
            }
        } else {
            showErrorModelFunction("Please select a block and enter your private ID!")
        }
    }

    function showErrorModelFunction(msg) {
        setErrorMSG(msg);
        setShowErrorModal(true);
    }

    return (
        <main>
            <TitleBar backLastPage="" lastPageName="nodedashboard" />
            <br />
            <div className='NodeUploadPage_topic'>Select One Customer Demand</div>
            <br />
            <div className='NodeUploadPage_DemandList' ref={container}>
                {
                    blocks ? blocks.map(block => {
                        return block.bid !== 0 ? <CustomerDemands key={block.bid} {...block} selectedBlock={selectedBlock} setSelectedBlock={setSelectedBlock} container={container} /> : null;
                    }) : null
                }
            </div>
            <br />
            <Form className="NodeUploadPage_Form">
                <div className="form-floating">
                    <Form.Group className="mb-3">
                        <Form.Label>Input Your Private ID for Confirmation</Form.Label>
                        <Form.Control type="text" onChange={e => setInputedPrivateID(e.target.value)} />
                    </Form.Group>
                </div>
            </Form>
            <div className='NodeUploadPage_submit_div'>
                <input className="NodeUploadPage_submit_btn" type="button" value="Publish" onClick={publicBlock} />
            </div>
            <br />

            <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorTitleMSG='Input Error' errorMSG={errorMSG} />
        </main>
    )
}
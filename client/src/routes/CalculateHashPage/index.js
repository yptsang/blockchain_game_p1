import React, { useContext, useState, useEffect } from 'react'
import TitleBar from '../../comonents/TitleBar'
import './index.css'
import { useNavigate } from 'react-router-dom'
import { Context } from '../../context/Context'
import Timer from '../../comonents/Timer'
import axios from '../../axios'
import ErrorModal from '../../comonents/ErrorModal';
import { EXPRESS_SERVER_URL } from "../../config";

export default function CalculateHashPage() {

    const navigate = useNavigate();

    const { blockDetail, sessionInfo, sessionID, socket } = useContext(Context);
    const { bid, cid, pdid, pdq, pdn, dd, ph } = blockDetail;

    const [nonce, setNonce] = useState(null);
    const [hash, setHash] = useState(null);
    const [pvid, setPvid] = useState(null);

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMSG, setErrorMSG] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    let monthNames = ["Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"];

    var date
    var dateStr

    if (dd) {
        date = new Date(dd.substring(0, 19) + "-08:00");
        dateStr = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
    }

    const checkMinerCanMineThisBox = async () => {
        try {
            const check_result = await axios(`${EXPRESS_SERVER_URL}/game1/session/${sessionID}/blocks/${bid}/miners/check`, { method: 'GET' })
            const check_json = await check_result.data
            if (check_json.status === 0 && check_json.count === 0) {
                setShowRejectModal(true);
            } else if (check_json.status !== 0) {
                showErrorModelFunction(check_json.err)
            }
        } catch (err) {
            console.log(err)
            showErrorModelFunction('Error: ' + err.message)
        }
    }

    const modalCallback = () => {
        navigate(-1);
    }

    const submitHash = async (e) => {
        e.preventDefault();
        try {
            if (bid && nonce && hash && pvid) {
                const result = await axios(`${EXPRESS_SERVER_URL}/game1/session/miners/blocks`, {
                    method: 'POST',
                    data: { bid, nonce, hash, pvid }
                })
                const json = await result.data
                if (json.status === 0) {
                    const result = await axios(`${EXPRESS_SERVER_URL}/game1/session/blocks/votes`, {
                        method: 'PUT',
                        data: { bid, sid: sessionID }
                    })
                    const json = await result.data
                    if (json.status === 0) {
                        socket.emit("update_game1_votes", { sid: sessionID, bid: bid });
                        navigate('/hashboardwaiting');
                    } else {
                        console.log(json.err);
                    }
                } else {
                    console.log(json.err)
                    if (json.err === "Your Private ID is incorrect") {
                        showErrorModelFunction("Your Private ID is incorrect!")
                    } else {
                        showErrorModelFunction(json.err)
                    }
                }
            } else {
                showErrorModelFunction("Please answer all 3 blanks!")
            }
        } catch (err) {
            console.log(err)
            showErrorModelFunction('Error: ' + err.message)
        }
    }

    const checkIsMined = async () => {
        try {
            const result = await axios(`${EXPRESS_SERVER_URL}/game1/session/${sessionID}/miners/pbid/blocks/${bid}`, {
                method: 'GET'
            })
            const json = await result.data
            if (json.status === 0 && json.count) {
                navigate('/hashboardwaiting');
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        checkMinerCanMineThisBox();
        checkIsMined();
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
        return () => {
            socket.off("game1_block_end", game1_block_end_listener);
            socket.off("game1_block_force_chained", teacher_force_chained_listener);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function showErrorModelFunction(msg) {
        setErrorMSG(msg);
        setShowErrorModal(true);
    }

    return (
        <div className='row'>
            <TitleBar backLastPage="" lastPageName="minerdashboard" />
            <div className='col-4 btn_margin_help' style={{ paddingTop: '2%', paddingBottom: '2%', paddingLeft: '10%', paddingRight: '10%' }}>
                <input type="button" onClick={() => navigate('/help')} className=' text-center btn_help ' value="HELP?" />
            </div>
            <div className="col-4"></div>
            <div className=' text-center col-4'>
                <p className='time_border'>
                    <Timer />
                </p>

            </div>

            <div style={{ paddingLeft: '6%' }}>
                <p>
                    Calculation of the Hash Value<br />
                    Block Index: {bid}<br />
                    Public ID: {sessionInfo.tid}<br />

                </p>
            </div>

            <div className='player_info' style={{ paddingLeft: '17%', paddingRight: '17%',width:'90%',marginLeft:"5%",marginRight:"3%" }}>

<table class="table align-middle table-borderless"  >

    <tbody className='text-center' >
        <tr >
            <td> Customer ID</td>
            <td className='text-start'>: {cid}</td>
        </tr>
        <tr>
            <td>Product ID</td>
            <td className='text-start'>: {pdid}</td>
        </tr>
        <tr>

            <td>Product Quantity</td>
            <td className='text-start'>: {pdq}</td>
        </tr>
        <tr  >
            <td>Product Name</td>
            <td className='text-start'>: {pdn}</td>
        </tr>
        <tr  >
            <td>Delivery Date</td>
            <td className='text-start'>: {dateStr}</td>
        </tr>

    </tbody>
</table>


</div>

            <div className='phv_text'>
                <p >Previous Hash Value (last 3 digits): {ph}</p>

            </div>
            <div className="bar_ch">
                Calculate the Nonce and Hash Value
            </div>
            <form className="btn_group_ch" >
                <div className="mb-4">
                    <label for="privateId" className="form-label">Input Your Private ID for Confirmation</label>
                    <input type="text" className="form-control" id="privateId" onChange={e => setPvid(e.target.value)} />

                </div>
                <div className="mb-4">
                    <label for="nonce" className="form-label">Nonce</label>
                    <input type="text" className="form-control" id="nonce" onChange={e => setNonce(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label for="hashvalue" className="form-label" >Hash Value</label>
                    <input type="text" className="form-control" id="hashvalue" onChange={e => setHash(e.target.value)} />
                </div>

                <button className="btn" onClick={submitHash} >Submit</button>
            </form>
            <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorTitleMSG='Input Error' errorMSG={errorMSG} />
            {/* callback modal */}
            <ErrorModal showErrorModal={showRejectModal} setShowErrorModal={modalCallback} errorTitleMSG='Hi newcomer' errorMSG="Please wait for the next block" />
        </div>
    )
}

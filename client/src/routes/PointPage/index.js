import React, { useEffect, useContext, useState } from 'react';
import TitleBar from '../../comonents/TitleBar';
// import Tables from '../../comonents/Table/index';
import ChartBarModal from '../../comonents/ChartBarModal'
import './index.css'
import { useNavigate } from 'react-router-dom';
import { Context } from '../../context/Context'
import { EXPRESS_SERVER_URL } from "../../config";
import axios from '../../axios'
import Tables from '../../comonents/Table/index';
import Cookies from 'js-cookie'

export default function PointPage() {
    // const json = { title: "Hash-board", head: ["Timestamp", "Public ID", "Nonce", "Hash Value", "Verification"], body: [{ x: 1, x2: 2, x3: 3, x4: 2 }, { x: 1, x2: 2, x3: 3, x4: 3 }, { x: 1, x2: 2, x3: 3, x4: 3 }, { x: 1, x2: 2, x3: 3, x4: 3 }, { x: 1, x2: 2, x3: 3, x4: 3 }] }
    const navigate = useNavigate();

    const { gameOver, sessionID, socket, sessionInfo, setSessionInfo } = useContext(Context);

    const [miners, setMiners] = useState([]);
    const [response, setResponse] = useState([]);
    const [useLastPage, setUseLastPage] = useState("A");

    const getMiners = async () => {

        const result = await axios(`${EXPRESS_SERVER_URL}/game1/session/${sessionID}/miners/rank`, { method: 'GET' })
        const json = await result.data

        if (json.status === 0) {
            setMiners(json.miners);
            setResponse({ table_type: "table_col_3", head: ["Public ID", "Points", "Rank"], body: json.miners });
        } else {
            console.log(json.err);
        }

    }

    useEffect(() => {
        getMiners();
        if (Cookies.get('userType') == "Teacher") {
            setUseLastPage("nodehome")
        } else {
            setUseLastPage("minerhome")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <main>
            <TitleBar backLastPage="" lastPageName={useLastPage} />
            <br />
            <ChartBarModal data={miners} />
            <br />
            <div className='PointPage_RankTable_div'>
                <Tables json={response} />
            </div>
            <br />
            <div className='PointPage_Export_div'>
                <input className="PointPage_Export_btn" type="button" value="Export Whole Blockchain" onClick={() => navigate('/allblock')} />
            </div>
            <br />
            <div className='PointPage_Export_div'>
                {/* <input className="PointPage_Export_btn" type="button" value="Logout" /> */}
                <input className="PointPage_Export_btn" type="button" value="Logout" style={gameOver ? { display: "inline", backgroundColor: "lightgreen" } : { display: "none", backgroundColor: "lightgreen" }} onClick={() => { navigate('/login') }} />
            </div>
            <br />
        </main>
    )
}
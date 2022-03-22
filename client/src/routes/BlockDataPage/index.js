import React, { useContext } from 'react';
import TitleBar from '../../comonents/TitleBar';
import './index.css'
import { Context } from '../../context/Context'
import { useNavigate } from 'react-router-dom'

export default function BlockDataPage() {

    const { blockDetail, sessionInfo } = useContext(Context);
    const { bid, cid, pdid, pdq, pdn, dd } = blockDetail;

    const navigate = useNavigate();


    let monthNames = ["Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"];

    var date
    var dateStr

    if (dd) {
        date = new Date(dd.substring(0, 19) + "-08:00");
        dateStr = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
    }

    return (
        <main>
            <TitleBar backLastPage="" lastPageName="" />
            <br />
            <div className='BlockDataPage_topic'>Detail of the Block Data</div>
            <br />
            <div className='BlockDataPage_numOfBlock'>Block Index: {bid}</div>
            <br />
            <div className='BlockDataPage_Demand_div'>
                <div className='BlockDataPage_Demand'>
                    <div className='BlockDataPage_Demand_topic'>Data 1</div>
                    <div className='BlockDataPage_HashBox'>
                        <div className='BlockDataPage_HashBox_left'>Public ID</div>
                        <div className='BlockDataPage_HashBox_right'>: {sessionInfo.tid}</div>
                    </div>
                    <div className='BlockDataPage_HashBox'>
                        <div className='BlockDataPage_HashBox_left'>Customer ID</div>
                        <div className='BlockDataPage_HashBox_right'>: {cid}</div>
                    </div>
                    <div className='BlockDataPage_HashBox'>
                        <div className='BlockDataPage_HashBox_left'>Product ID</div>
                        <div className='BlockDataPage_HashBox_right'>: {pdid}</div>
                    </div>
                    <div className='BlockDataPage_HashBox'>
                        <div className='BlockDataPage_HashBox_left'>Product Quantity</div>
                        <div className='BlockDataPage_HashBox_right'>: {pdq}</div>
                    </div>
                    <div className='BlockDataPage_HashBox'>
                        <div className='BlockDataPage_HashBox_left'>Product Name</div>
                        <div className='BlockDataPage_HashBox_right'>: {pdn}</div>
                    </div>
                    <div className='BlockDataPage_Demand_lastItem BlockDataPage_HashBox'>
                        <div className='BlockDataPage_HashBox_left'>Delivery Date</div>
                        <div className='BlockDataPage_HashBox_right'>: {dateStr ? dateStr : null}</div>
                    </div>
                </div>
            </div>
            <div className='BlockDataPage_submit_div'>
                <input className="BlockDataPage_submit_btn" type="button" value="Back" onClick={() => navigate(-1)} />
            </div>
            <br />
        </main>
    )
}
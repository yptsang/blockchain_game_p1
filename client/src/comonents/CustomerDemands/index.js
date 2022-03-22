import React, { useEffect, useRef } from 'react'
import './index.css'

export default function CustomerDemands(props) {
    const { bid, cid, pdid, pdq, pdn, dd, selectedBlock, setHeight } = props;
    // const {  setSelectedBlock } = props;

    // let monthNames = ["Jan", "Feb", "Mar", "Apr",
    //     "May", "Jun", "Jul", "Aug",
    //     "Sep", "Oct", "Nov", "Dec"];

    const date = new Date(dd.substring(0, 19) + "-08:00");
    const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

    return (
        <main className='CustomerDemands_boxPadding'>
            <div className='CustomerDemands_box'
                style={selectedBlock === bid ?
                    { backgroundColor: "rgba(235,245,179,255)" } : null} onClick={() => { /*setSelectedBlock(bid)*/ }}>
                <div className='CustomerDemands_firstItem CustomerDemands_HashBox'>
                    <div className='CustomerDemands_HashBox_left'>Customer ID</div>
                    <div className='CustomerDemands_HashBox_right'>: {cid}</div>
                </div>
                <div className='CustomerDemands_HashBox'>
                    <div className='CustomerDemands_HashBox_left'>Product ID</div>
                    <div className='CustomerDemands_HashBox_right'>: {pdid}</div>
                </div>
                <div className='CustomerDemands_HashBox'>
                    <div className='CustomerDemands_HashBox_left'>Product Quantitly</div>
                    <div className='CustomerDemands_HashBox_right'>: {pdq}</div>
                </div>
                <div className='CustomerDemands_HashBox'>
                    <div className='CustomerDemands_HashBox_left'>Product Name</div>
                    <div className='CustomerDemands_HashBox_right'>: {pdn}</div>
                </div>
                <div className='CustomerDemands_lastItem CustomerDemands_HashBox'>
                    <div className='CustomerDemands_HashBox_left'>Delivery Date</div>
                    <div className='CustomerDemands_HashBox_right'>: {dateStr}</div>
                </div>
            </div>
        </main>
    )

}

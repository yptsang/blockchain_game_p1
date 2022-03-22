import { React, useState } from 'react'
import './index.css'

export default function BlockItem(props) {
    const { background, setBlockHashs, item } = props

    let monthNames = ["Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"];

    var date
    var dateStr

    if (item.dd) {
        date = new Date(item.dd.substring(0, 19) + "-08:00");
        dateStr = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
    }

    const updateHash = (e) => {
        setBlockHashs(pre =>
            pre.map((hash, key) => {
                if (key !== item.bid) {
                    return hash;
                } else {
                    return parseInt(e.target.value);
                }
            })
        )
    }

    return (
        <div >
            <table className='BlockItem_box'>
                <tbody>
                    <tr>

                        <td className='BlockItem_box_td1'>
                            <div href="" className='BlockItem_box_left' style={{ backgroundColor: background }}>
                                <div className='BlockItem_box_topic_left'>Data </div>
                                <div className='BlockItem_firstItem'>Customer ID: {item.cid}</div>
                                <div>Product ID: {item.pdid}</div>
                                <div>Product Quantity: {item.pdq}</div>
                                <div>Product Name: {item.pdn}</div>
                                <div className='BlockItem_lastItem'>Delivery Date: {dateStr}</div>
                            </div>
                        </td>


                        <td className='BlockItem_box_td2'></td>


                        <td className='BlockItem_box_td3'>
                            <div href="" className='BlockItem_box_right' style={{ backgroundColor: background }}>
                                <div className='BlockItem_box_topic_right'>Data  {item.bid}</div>
                                <div className='BlockItem_HashBox'>
                                    <div className='BlockItem_HashBox_left'>Pre. Hash</div>
                                    <div className='BlockItem_HashBox_right'>: {item.ph}</div>
                                </div>
                                <div className='BlockItem_HashBox'>
                                    <div className='BlockItem_HashBox_left'>Hash</div>
                                    <div className='BlockItem_HashBox_right BlockItem_HashBox'>
                                        <div className='BlockItem_input_left'>:</div>
                                        <input pattern="[0-9]*" className='BlockItem_input_right' onChange={updateHash} defaultValue={item.hash} />
                                    </div>
                                </div>
                                <div className='BlockItem_HashBox'>
                                    <div className='BlockItem_HashBox_left'>Nonce</div>
                                    <div className='BlockItem_HashBox_right'>: {item.nonce}</div>
                                </div>

                            </div>
                        </td>

                    </tr>
                </tbody>
            </table>
            <br />
        </div>
    )
}

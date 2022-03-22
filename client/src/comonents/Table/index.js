import { React, useState, useContext } from 'react'
import PieChat from '../PieChat';
import './index.css'
import { Context } from '../../context/Context'
import { useNavigate } from 'react-router-dom'


export default function Tables(props) {

    // const sessionInfo = props.sessionInfo;

    var json = props.json;
    var t_type = json.table_type
    var ths = json.head
    var tds = json.body
    const { userType, setBlockDetail } = useContext(Context);
    // const [userType, setUserType] = useState("Student")
    const [done, setDone] = useState(false)
    //table_col_4
    //table_col_5_button
    //table_col_4_button
    //table_barchat

    const navigate = useNavigate();

    function dateF(d) {
        let monthNames = ["Jan", "Feb", "Mar", "Apr",
            "May", "Jun", "Jul", "Aug",
            "Sep", "Oct", "Nov", "Dec"];

        var date = new Date(d);
        return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`

    }

    const read_th = () => {
        if (ths !== null) {
            return (
                ths.map((item) => {
                    return (
                        <th>
                            {item}
                        </th>
                    )
                })
            )
        } else {
            return null;
        }
    }
    const Detail_btn = (value, item) => {
        if (userType === "Student") {
            if (value === 1) {
                return (
                    <td className='text-center '>
                        <label >Chained</label>
                        <br />
                        <button type='button' className='table_btn_false' onClick={() => { setBlockDetail(item); navigate('/chainedblockdetail') }}>Detail</button>
                    </td>
                )
            } else if (value === 2) {
                return (
                    <td className='text-center '>
                        <label >Failed</label>
                        <br />
                        <button type='button' className='table_btn_false' onClick={() => { setBlockDetail(item); navigate('/chainedblockdetail') }}>Detail</button>
                    </td>
                )
            } else {
                return (
                    <td className='text-center '>
                        <label >Created</label>
                        <br />
                        <button type='button' className='table_btn_false' onClick={() => { setBlockDetail(item); navigate('/calculatehash') }}>Mine</button>
                    </td>
                )
            }
        } else {
            if (value === 1) {
                return (
                    <td className='text-center '>
                        <label >Chained</label>
                        <br />
                        <button type='button' className='table_btn_false' onClick={() => { setBlockDetail(item); navigate('/chainedblockdetail') }}>Detail</button>
                    </td>
                )
            } else if (value === 2) {
                return (
                    <td className='text-center '>
                        <label >Failed</label>
                        <br />
                        <button type='button' className='table_btn_false' onClick={() => { setBlockDetail(item); navigate('/chainedblockdetail') }}>Detail</button>
                    </td>
                )
            } else {
                return (
                    <td className='text-center '>
                        <label >Created</label>
                        <br />
                        <button type='button' className='table_btn_false' onClick={() => { setBlockDetail(item); navigate('/verification') }}>Verification</button>
                    </td>
                )
            }
        }
    }

    const TF_btn = (value, correct) => {

        if (correct === 1) {
            return (
                <td className='text-center '>
                    <label >{(value / (props.total + 1)) * 100}%</label>
                    <br />
                    <button type='button' className='table_btn_true'>True</button>
                </td>
            )
        } else {
            return (
                <td className='text-center '>
                    <label >{(value / (props.total + 1)) * 100}%</label>
                    <br />
                    <button type='button' className='table_btn_false'>False</button>
                </td>
            )
        }

    }
    const read_tds = () => {
        if (tds !== null) {
            if (t_type === "table_col_3") {
                var rank = 1;
                return (
                    tds.map((item, key) => {
                        rank++;
                        if (rank > 6) {
                            return (
                                <tr>
                                    <td>{item.pbid}</td>
                                    <td>{item.points}</td>
                                    <td>{rank - 1}</td>
                                </tr>
                            )
                        } else {
                            return null;
                        }
                    })
                )
            } else if (t_type === "table_col_4") {
                return (
                    tds.map((item, key) => {
                        return (
                            <tr>
                                <td>{key + item.td1}</td>
                                <td>{key + item.td2}</td>
                                <td>{key + item.td3}</td>
                                <td>{key + item.td4}</td>
                            </tr>
                        )
                    })
                )
            } else if (t_type === "table_col_5_button") {
                return (
                    tds.map((item) => {
                        return (
                            <tr key={item.pbid}>
                                <td>{dateF(item.ad)}</td>
                                <td>{item.pbid}</td>
                                <td>{item.nonce}</td>
                                <td>{item.hash}</td>
                                {TF_btn(item.votes, item.correct)}
                            </tr>
                        )
                    })
                )
            } else if (t_type === "table_col_4_button") {
                return (
                    tds.map((item) => {

                        if (item.bid > 0 && item.cd !== null) {
                            return (
                                <tr key={item.bid}>

                                    <td>{item.bid}</td>
                                    <td style={{ padding: 'none' }}><button type="button" className='table_btn_detail' onClick={() => { setBlockDetail(item); navigate('/blockdata') }}>Detail</button></td>
                                    <td>{dateF(item.cd)}</td>
                                    {Detail_btn(item.isChained, item)}
                                </tr>
                            )
                        } else {
                            return null;
                        }
                    })
                )
            } else if (t_type === "table_barchat") {
                return (
                    tds.map((item, key) => {
                        return (
                            <tr>

                                <td>{dateF(item.ad)}</td>
                                <td>{item.pbid}</td>
                                <td>{item.nonce}</td>
                                <td>{item.hash}</td>
                                <td>{<PieChat data={[{ name: "Vote", value: item.votes }, { name: "Other", value: (props.total - item.votes) + 1 }]} />}</td>
                            </tr>
                        )
                    })
                )
            } else {
                return null;
            }
        }
    }



    if (t_type === "table_col_3") {
        return (
            <div>
                <table className="table table-bordered">
                    <thead>
                        <tr className='text-center ths'>
                            {read_th()}
                        </tr>
                        <div></div>
                    </thead>
                    <tbody className='text-center tds'  >
                        {read_tds()}
                    </tbody>
                </table>
            </div>
        )
    } else if (t_type === "table_col_4") {
        return (
            <div>
                <table className="table table-bordered">
                    <thead>
                        <tr className='text-center ths'>
                            {read_th()}
                        </tr>
                        <div></div>
                    </thead>
                    <tbody className='text-center tds'  >
                        {read_tds()}
                    </tbody>
                </table>
            </div>
        )
    } else if (t_type === "table_col_5_button") {
        return (
            <div>
                <table className="table table-bordered">
                    <thead>
                        <tr className='text-center ths'>
                            {read_th()}
                        </tr>
                        <div></div>
                    </thead>

                    <tbody className='text-center tds'  >
                        {read_tds()}
                    </tbody>
                </table>
            </div>
        )
    } else if (t_type === "table_col_4_button") {
        return (
            <div>
                <table className="table table-bordered">
                    <thead>
                        <tr className='text-center ths'>
                            {read_th()}
                        </tr>
                        <div></div>
                    </thead>

                    <tbody className='text-center tds'  >
                        {read_tds()}
                    </tbody>
                </table>
            </div>
        )
    } else if (t_type === "table_barchat") {
        return (
            <div>
                <table className="table table-bordered">
                    <thead>
                        <tr className='text-center ths'>
                            {read_th()}
                        </tr>
                        <div></div>
                    </thead>

                    <tbody className='text-center tds'  >
                        {read_tds()}
                    </tbody>
                </table>
            </div>
        )
    } else {
        return null;
    }

}
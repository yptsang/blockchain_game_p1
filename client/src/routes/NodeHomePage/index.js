import React, { useContext } from 'react';
import TitleBar from '../../comonents/TitleBar';
import BtnShow from '../../comonents/Buttons';
import './index.css'
// import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie'
import { Context } from '../../context/Context'
// import { EXPRESS_SERVER_URL, COOKIES_EXPIRES_TIME } from "../../config";
// import axios from '../../axios'
import copy from 'copy-to-clipboard';
import Cookies from 'js-cookie'

export default function NodeHomePage() {
    const dashboard = { w: '100%', h: 'auto', c: 'gainsboro', r: '20px' }
    const points = { w: '100%', h: 'auto', c: 'gainsboro', r: '20px' }
    // const navigate = useNavigate();

    const { userInfo, privateID } = useContext(Context);

    // async function Get_Information(e) {
    // const result = await axios(`${EXPRESS_SERVER_URL}/game1/session/`, {
    //     method: 'POST',
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    // data: { pbid: studentId.replace(/\s*/g, ""), passcode: passCode.replace(/\s*/g, "") }
    // })
    // }

    return (
        <div>
            <TitleBar backLastPage="" lastPageName="" />

            <div className='minter_h_btns'>
                <div className='col  minter_h_border ' style={{ marginTop: "1rem" }} >

                    <table class="table  align-middle table-borderless ">

                        <tbody>
                            <tr className='text-center' >
                                <td width='150px'>Passcode</td>

                                <td width='150px' className='text-start' >:{Cookies.get('passcode')}</td>
                                <td width='170px'  > <input className="PasscodeModal_btn_Copy" type="button" style={{width:'4rem'}} value="Copy" onClick={e => copy(Cookies.get('passcode'))} /></td>
                            </tr>
                            <tr className='text-center'>

                                <td width='150px'>Your Public ID</td> 
                                <td width='150px' className='text-start'> :{userInfo}</td>
                            </tr>
                            <tr className='text-center'>
                                <td width='150px'>Your Private ID</td>
                                <td width='150px' className='text-start'>:{privateID}</td>
                                <td width='170px'  ><input className="PasscodeModal_btn_Copy " type="button" style={{width:'4rem'}}  value="Copy" onClick={e => copy(privateID)} /></td>
                            </tr>
                        </tbody>
                    </table>








                </div>

                <div className='col'>
                    <BtnShow text="Dashboard" link="/nodedashboard" css={dashboard} />
                </div>

                <div className='col'>
                    <BtnShow text="Points" link="/point" css={points} />
                </div>
            </div>
        </div >
    )
}
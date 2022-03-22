import React, { useContext } from 'react'
import TitleBar from '../../comonents/TitleBar';
import BtnShow from '../../comonents/Buttons';
import './index.css'
// import axios from '../../axios'
// import Cookies from 'js-cookie'
import { Context } from '../../context/Context';
// import { EXPRESS_SERVER_URL } from "../../config"
import copy from 'copy-to-clipboard';
import Cookies from 'js-cookie'

export default function MinerHome() {
    const dashboard = { w: '100%', h: 'auto', c: 'gainsboro', r: '20px' }
    const points = { w: '100%', h: 'auto', c: 'gainsboro', r: '20px' }
    //href is link
    // Context
    const { userInfo, privateID } = useContext(Context);

    return (
        <div>
            <TitleBar backLastPage="" lastPageName="" />

            <div className='minter_h_btns'>
                <div className='col text-center minter_h_border'  >
                    <table class="table  align-middle table-borderless">

                        <tbody>
                            <tr className='text-center' >
                                <td width='150px'>Passcode</td>

                                <td width='150px' className='text-start' >:{Cookies.get('passcode')}</td>
                                <td width='170px'  > <input className="PasscodeModal_btn_Copy" type="button" style={{ width: '4rem' }} value="Copy" onClick={e => copy(Cookies.get('passcode'))} /></td>
                            </tr>
                            <tr className='text-center'>

                                <td width='150px'>Your Public ID</td>
                                <td width='150px' className='text-start'> :{userInfo}</td>
                            </tr>
                            <tr className='text-center'>
                                <td width='150px'>Your Private ID</td>
                                <td width='150px' className='text-start'>:{privateID}</td>
                                <td width='170px'  ><input className="PasscodeModal_btn_Copy " type="button" style={{ width: '4rem' }} value="Copy" onClick={e => copy(privateID)} /></td>
                            </tr>
                        </tbody>
                    </table>








                </div>

                <div className='col'>
                    <BtnShow text="Dashboard" link="/minerdashboard" css={dashboard} />
                </div>

                <div className='col'>
                    <BtnShow text="Points" link="/point" css={points} />
                </div>
            </div >
        </div >
    )
}

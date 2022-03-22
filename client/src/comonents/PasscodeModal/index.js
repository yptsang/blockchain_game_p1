import React, { useState } from 'react';
import { Modal, } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import copy from 'copy-to-clipboard';

import './index.css'

export default function PasscodeModal(props) {
    var { showPasscodeModal, setShowPasscodeModal, passcode } = props;
    const [btn_color,setBtnColor] =useState("#bbbbbb")
    const navigate = useNavigate();

    const copyPasscode = () => {
        setBtnColor("#B9E9FF")
        copy(passcode);
    }

    return (
        <Modal
            show={showPasscodeModal}
            onHide={() => setShowPasscodeModal(false)}
            aria-labelledby="example-modal-sizes-title-lg"
            backdrop="static"
            centered>
            <Modal.Body>
                <div className='PasscodeModal_body'>
                    <div className='PasscodeModal_title'>Your Passcode is:</div>
                    <div className='PasscodeModal_PasscodeBox'>
                        <div>{passcode}</div>
                        <div className="PasscodeModal_div_Copy">
                            <input className="PasscodeModal_btn_Copy" style={{background:btn_color}} type="button" value="Copy" onClick={copyPasscode} />
                            
                        </div>
                    </div>
                    <div className="PasscodeModal_div_Continue">
                        <input className="PasscodeModal_btn_Continue" type="button" value="Continue" onClick={() => navigate('/scenario')} />
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}


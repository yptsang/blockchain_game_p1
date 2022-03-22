import React, { useState } from 'react';
import { Button, Modal, } from 'react-bootstrap';
import './index.css'
import { useNavigate } from 'react-router-dom'

export default function PointsMessageModal(props) {

    const navigate = useNavigate();

    var { showPointsMessageModalModal, sequencNo, point } = props;

    if (point <= 0) {
        return (
            <Modal
                show={showPointsMessageModalModal}
                onHide={() => { }}
                aria-labelledby="example-modal-sizes-title-lg"
                centered>

                <Modal.Body>
                    <div className="modal_body text-center">
                        <b>Thank You for Your Mining Effort!</b>
                        <p />
                        <p> The block has been verified and
                            <br />added in the blockchain</p>
                        <hr />

                        <h4> <p className="modal_point" > + 0 Point </p></h4>
                    </div>

                </Modal.Body>
                <Modal.Footer  >
                    <div className="setShowLoginModal_div_back">
                        <input className='btn_div_back text-center' type="button" onClick={() => { navigate('/minerdashboard') }} value="Back" />
                    </div>
                </Modal.Footer>
            </Modal>
        )
    } else {
        return (
            <Modal
                show={showPointsMessageModalModal}
                onHide={() => { }}
                aria-labelledby="example-modal-sizes-title-lg"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal_body text-center">
                        <b>Congratulation!</b>
                        <p />
                        <p> Your Calculated hash value is same
                            <br />
                            as the value with over 50% votes.
                            <br />
                            Your sequence no.:{sequencNo}
                        </p>
                        <hr />

                        <h4> <p className="modal_point" > + {point} Point </p></h4>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <div className="setShowLoginModal_div_back">
                        <input className='btn_div_back text-center' type="button" onClick={() => { navigate('/minerdashboard') }} value="Back" />
                    </div>
                </Modal.Footer>
            </Modal>)
    }

}


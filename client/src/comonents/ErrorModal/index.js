import React from 'react'
import './index.css';
import { Button, Modal, } from 'react-bootstrap';

export default function ErrorModal(props) {

    var { errorTitleMSG, errorMSG, showErrorModal, setShowErrorModal, } = props;

    return (
        <Modal
            show={showErrorModal}
            onHide={() => setShowErrorModal(false)}
            aria-labelledby="example-modal-sizes-title-lg"
            centered
            className="ErrorModal_ModalStyle">
            <Modal.Header className="ErrorModal_Modalbc">
                <Modal.Title>{errorTitleMSG}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="ErrorModal_Modalbc">
                {errorMSG}
            </Modal.Body>

            <Modal.Footer className="ErrorModal_Modalbc">
                <Button variant="secondary" onClick={() => setShowErrorModal(false)} className="LoginPage_ModalCloasebtn">Close</Button>
            </Modal.Footer>
        </Modal>
    )
}
import React, { useState, useContext } from 'react';
import { Form, } from 'react-bootstrap';
import { Modal, } from 'react-bootstrap';
import './index.css'
import axios from '../../axios'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import { EXPRESS_SERVER_URL, COOKIES_EXPIRES_TIME } from "../../config";
import ErrorModal from '../ErrorModal';
import { Context } from '../../context/Context'
import { socket as socketio } from "../../socket"

export default function LoginModal(props) {
    const [teacherId, setTeacherId] = useState('');
    const [teacherPWD, setTeacherPWD] = useState('');

    const navigate = useNavigate();
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMSG, setErrorMSG] = useState('');
    var { showLoginModal, setShowLoginModal, setLogin, setUserType, setUserInfo } = props;
    const { setPrivateID, setPasscode, setSessionID } = useContext(Context);

    function checkHaveData(str) {
        if (str === '') return true;
    }

    function checkHaveSpace(str) {
        if (str.trim().length === 0) return true;
    }

    async function Login_teacher(e) {

        if (checkHaveData(teacherId) || checkHaveData(teacherPWD)) {
            setErrorMSG("Please enter your Teacher ID and Password!")
            setShowLoginModal(false)
            setShowErrorModal(true)
            return
        }

        if (checkHaveSpace(teacherId) && checkHaveSpace(teacherPWD)) {
            setErrorMSG("Please don't only space")
            setShowLoginModal(false)
            setShowErrorModal(true)
            return
        }

        try {
            e.preventDefault();
            const result = await axios(`${EXPRESS_SERVER_URL}/auth/teacher`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: { tid: teacherId.replace(/\s*/g, ""), pw: teacherPWD.replace(/\s*/g, "") }
            })
            const json = await result.data;
            if (json.status === 0) {
                setLogin(json.token);
                setUserType("Teacher")
                setUserInfo(teacherId.replace(/\s*/g, ""))
                Cookies.set("token", json.token, { expires: COOKIES_EXPIRES_TIME })
                Cookies.set("userType", "Teacher")
                socketio.emit("activate_game1", { id: Cookies.get('userInfo'), type: Cookies.get('userType') });
                // check session created
                const result2 = await axios(`${EXPRESS_SERVER_URL}/game1/session/tid`, { method: 'GET' })
                const json2 = await result2.data;
                console.log(json2);
                if (json2.status === 0) {
                    if (json2.session && json2.session.info && json2.session.info.sid) {
                        setPrivateID(json2.session.info.pid);
                        setPasscode(json2.session.info.passcode);
                        setSessionID(json2.session.info.sid);
                        navigate('/nodedashboard');
                    } else {
                        navigate('/gamesetting');
                    }
                } else {
                    setErrorMSG(json2.err)
                    setShowLoginModal(false)
                    setShowErrorModal(true)
                }
            } else {
                if (json.err === "Account is already logged in") {
                    setErrorMSG("Account is already logged in!")
                    setShowLoginModal(false)
                    setShowErrorModal(true)
                }else{
                    setErrorMSG(json.err)
                    setShowErrorModal(true)
                }
            }
        } catch (err) {
            setErrorMSG(err.response ? err.response.data.error : err.message)
            setShowLoginModal(false)
            setShowErrorModal(true)
        }
    }

    return (
        <main>
            <Modal
                show={showLoginModal}
                onHide={() => setShowLoginModal(false)}
                aria-labelledby="example-modal-sizes-title-lg"
                backdrop="static"
                centered>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <Form className="loginModalForm">
                        <div className="form-floating">
                            <Form.Group className="mb-3" controlId="teacherid">
                                <Form.Label>Teacher ID</Form.Label>
                                <Form.Control type="teacherid" placeholder="Teacher ID" onChange={e => setTeacherId(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="teacherPWD" >
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="teacherPWD" placeholder="Teacher password" onChange={e => setTeacherPWD(e.target.value)} />
                            </Form.Group>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div className="setShowLoginModal_div_Login">
                        <input className="setShowLoginModal_btn_Login" type="button" value="Login" onClick={e => Login_teacher(e)} />
                    </div>
                </Modal.Footer>
            </Modal>

            <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorTitleMSG='Login Error' errorMSG={errorMSG} />
        </main>
    )
}


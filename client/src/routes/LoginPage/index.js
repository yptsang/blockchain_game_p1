import React, { useEffect, useState, useContext } from "react";
import { Form, } from 'react-bootstrap';
import LoginModal from "../../comonents/LoginModal";
import ErrorModal from '../../comonents/ErrorModal';
import './index.css'
import axios from '../../axios'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import { EXPRESS_SERVER_URL, COOKIES_EXPIRES_TIME, MAX_MINER_COUNT } from "../../config";
import { Context } from '../../context/Context'
// import { io } from "socket.io-client";

export default function LoginPage(props) {
    // Login Modal
    const [showLoginModal, setShowLoginModal] = useState(false);
    // Error Modal
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMSG, setErrorMSG] = useState('');
    const [studentId, setStudentId] = useState('');
    const [passCode, setPassCode] = useState('');
    // Context
    const { setPasscode, setHistoryLength, setLogin, setUserType, setUserInfo, setPrivateID, setSessionID, sessionID, socket } = useContext(Context);
    // navigate
    const navigate = useNavigate();

    function checkHaveData(str) {
        if (str === '') return true;
    }

    function checkHaveSpace(str) {
        if (str.trim().length === 0) return true;
    }

    useEffect(() => {
        Cookies.remove('token')
        Cookies.remove('userType')
        Cookies.remove('sessionID')
        setHistoryLength(0)
        setLogin(null)
        setUserType(null)
        if (socket) {
            socket.emit("leaveSession", sessionID);
            socket.emit("deactivate", sessionID);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function Login_student(e) {

        if (checkHaveData(studentId) || checkHaveData(passCode)) {
            setErrorMSG("Please enter your Student ID and Passcode!")
            setShowErrorModal(true)
            return
        }

        if (checkHaveSpace(studentId) && checkHaveSpace(passCode)) {
            setErrorMSG("Please don't only space")
            setShowErrorModal(true)
            return
        }

        try {
            e.preventDefault();
            const result = await axios(`${EXPRESS_SERVER_URL}/auth/student`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: { pbid: studentId.replace(/\s*/g, ""), passcode: passCode.replace(/\s*/g, "") }
            })
            const json = await result.data;
            if (json.status === 0) {
                Cookies.set("token", json.token, { expires: COOKIES_EXPIRES_TIME })
                const miner_count_result = await axios(`${EXPRESS_SERVER_URL}/game1/session/${json.sid}/miners/count`, { method: 'GET' })
                const miner_count_json = await miner_count_result.data;
                if (miner_count_json.count <= MAX_MINER_COUNT) {
                    setLogin(json.token);
                    setUserType("Student")
                    setUserInfo(studentId.replace(/\s*/g, ""))
                    Cookies.set("token", json.token, { expires: COOKIES_EXPIRES_TIME })
                    Cookies.set("userType", "Student")
                    const result2 = await axios(`${EXPRESS_SERVER_URL}/game1/session/miners`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                    })
                    const json2 = await result2.data;
                    if (json2.status === 0) {
                        setPrivateID(json2.pvid);
                        setSessionID(json2.sid);
                        setPasscode(passCode.replace(/\s*/g, ""));
                        socket.emit("activate_game1", { sid: json2.sid, id: studentId.replace(/\s*/g, ""), type: "Student" });
                        socket.emit("join_game1", json2.sid);
                        navigate('/scenario');
                    }
                } else {
                    Cookies.remove("token");
                    setErrorMSG("Game session full (max miner " + MAX_MINER_COUNT + ")");
                    setShowErrorModal(true)
                }
            } else {
                if (json.err === "Account is already logged in") {
                    setErrorMSG("Account is already logged in!")
                    setShowErrorModal(true)
                }else{
                    setErrorMSG(json.err)
                    setShowErrorModal(true)
                }
            }
        } catch (err) {
            setErrorMSG(err.response ? err.response.data.error : err.message)
            setShowErrorModal(true)
        }
    }

    return (
        <div className="loginPag_body">
            <div>
                <img src="/login_logo.jpeg" className="img-fluid" alt="" width={'100%'} />
                <div className=" div_title">
                    <div className="heading_MainTitle">BlockTrain</div>
                    <div className="heading_title">The Basic Training Game in Blockchain Concepts</div>
                </div>
            </div>

            <br />

            <Form className="loginForm" >
                <div className="form-floating">
                    <Form.Group className="mb-3" controlId="studentid">
                        <Form.Label>Student ID</Form.Label>
                        <Form.Control type="studentid" placeholder="Student ID" onChange={e => setStudentId(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="passcode" onChange={e => setPassCode(e.target.value)} >
                        <Form.Label>Passcode</Form.Label>
                        <Form.Control type="passcode" placeholder="Passcode" />
                    </Form.Group>
                </div>
            </Form>

            <div className="div_GameIn">
                <input className="btn_GameIn" type="button" value="Game in" onClick={e => Login_student(e)} />
            </div>
            <br />
            <div className="div_GameSettings">
                <input className="btn_GameSettings" type="button" value="Game Settings" onClick={() => setShowLoginModal(true)} />
            </div>
            <br />

            <LoginModal showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} setLogin={setLogin} setUserType={setUserType} setUserInfo={setUserInfo} />
            <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorTitleMSG='Login Error' errorMSG={errorMSG} />
        </div>
    )
}
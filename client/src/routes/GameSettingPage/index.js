import React, { useState, useContext, useRef, useEffect } from 'react';
import { Form } from 'react-bootstrap'
import TitleBar from '../../comonents/TitleBar';
import PasscodeModal from "../../comonents/PasscodeModal";
import './index.css'
import { EXPRESS_SERVER_URL } from "../../config";
import axios from '../../axios'
import { Context } from '../../context/Context'
// import { io } from "socket.io-client";
import ErrorModal from '../../comonents/ErrorModal';

export default function GameSettingPage() {
    const [showPasscodeModal, setShowPasscodeModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [creation, setCreation] = useState("5");
    const [mining, setMining] = useState("5");
    // const [selectedGame, setSelectedGame] = useState(1);
    const [xlsx, setXlsx] = useState(null);
    const [modalShowPasscode, setModalShowPasscode] = useState(0);
    const [selectGameColor, setSelectGameColor] = useState("");
    const [selectEdGame, setSelectEdGame] = useState(false);
    const [fileName, setFileName] = useState("");
    const [errorMSG, setErrorMSG] = useState('');
    const { setPrivateID, setPasscode, setSessionID, socket } = useContext(Context);
    const uploadFileData = useRef(null)

    const createGameSession = async () => {
        if(!selectEdGame){
            showErrorModelFunction("Please select a game!");
            return;
        }

        if (!xlsx) {
            showErrorModelFunction("Please upload an Excel file!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('tfbc', creation);
            formData.append('tfbm', mining);
            formData.append('xlsx', xlsx);
            const result = await axios(`${EXPRESS_SERVER_URL}/game1/session`, {
                method: 'POST',
                data: formData
            })
            const resultJson = await result.data;
            if (resultJson.status === 0) {
                setPrivateID(resultJson.pid);
                setPasscode(resultJson.passcode);
                setSessionID(resultJson.sid);
                setModalShowPasscode(resultJson.passcode);
                setShowPasscodeModal(true);
                socket.emit("join_game1", resultJson.sid);
            } else {
                console.log(resultJson.err);
                showErrorModelFunction(resultJson.err);
            }

        } catch (err) {
            console.log(err);
            showErrorModelFunction(err);
        }
    }

    function showErrorModelFunction(msg) {
        setErrorMSG(msg);
        setShowErrorModal(true);
    }

    function seletedGame(e) {
        setSelectEdGame(true)
        setSelectGameColor("chartreuse")
    }

    const uploadFileFunction = () => {
        uploadFileData.current.click()
    };

    useEffect(() => {
        if (xlsx != null) {
            console.log(xlsx.name);
            setFileName(xlsx.name);
        }
    }, [xlsx])

    return (
        <main>
            <TitleBar backLastPage="" lastPageName="" />
            <br />
            <div className='GameSettingPage_topic'>Game Settings</div>
            <br />
            <Form className="GameSettingPage_Form">
                <div className="form-floating">
                    <Form.Group className="mb-3">
                        <Form.Label>Time for Block Creation</Form.Label>
                        <Form.Select defaultValue={5} onChange={e => setCreation(e.target.value)}>
                            <option>5</option>
                            <option>10</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Time for Block Mining</Form.Label>
                        <Form.Select defaultValue={5} onChange={e => setMining(e.target.value)}>
                            <option >5</option>
                            <option >10</option>
                        </Form.Select>
                    </Form.Group>
                </div>
            </Form>

            <div className='GameSettingPage_GameList_topic'>Select Game:</div>


            <div className='GameSettingPage_GameList'>
                <input type="button" className='GameSettingPage_gamebox GameSettingPage_gameready' style={{ color: 'black', backgroundColor: selectGameColor }} value="Game 1: Simple PoW Blockchain (Only Miners)" onClick={e => seletedGame()} />
                <br /><br />
                <input type="button" className='GameSettingPage_gamebox' value="Game 2: Blockchain (Miners + Merkle Tree)" />
                <br /><br />
            </div>
            <br />
            <div className='GameSettingPage_DataList'>
                <table className='GameSettingPage_DataList_table'>
                    <tbody>
                        <tr>
                            <td className='GameSettingPage_DataList_td'>
                                <div className='GameSettingPage_DataList_topic'>Data:</div>
                            </td>
                            <td className='GameSettingPage_DataList_td'>
                                <input type="button" onClick={uploadFileFunction} className='GameSettingPage_DataList_btn' value="Browse" />
                                <input ref={uploadFileData} className='fileUpload' type="file" accept='.xlsx' onChange={e => setXlsx(e.target.files[0])} />
                                <label>{fileName}</label>
                            </td>
                            <td className='GameSettingPage_DataList_td'>
                                <a href={`${EXPRESS_SERVER_URL}/game1/template`} download><input type="button" className='GameSettingPage_DataList_btn' value="Download Template" /></a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br />
            <div className='GameSettingPage_submit_div'>
                <input className="GameSettingPage_submit_btn" type="button" value="Submit" onClick={createGameSession} />
            </div>
            <br />

            <PasscodeModal passcode={modalShowPasscode} showPasscodeModal={showPasscodeModal} setShowPasscodeModal={setShowPasscodeModal} />
            <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorTitleMSG='Input Error' errorMSG={errorMSG} />
        </main>
    )
}
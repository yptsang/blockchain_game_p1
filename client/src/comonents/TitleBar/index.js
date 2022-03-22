import React, { useContext, useEffect, useState } from 'react';
import { Col, Button } from 'react-bootstrap'
import ArrowLeft from '../Icons/Arrow-left'
import './index.css'
import { useNavigate } from 'react-router-dom';
import { Context } from '../../context/Context'

export default function TitleBar(props) {
    var { lastPageName } = props;
    const { setHistoryLength, historyLength, } = useContext(Context);
    const [ backLastPage, setBackLastPage] = useState('none')
    const navigate = useNavigate();

    useEffect(() => {
        if (lastPageName != "") {
            setBackLastPage("")
        }
    }, [])

    function test() {
        var backPage = "/" + lastPageName;
        navigate(backPage);
        // setHistoryLength(historyLength - 2)
        // const h = historyLength - 1;
        // if (h <= 0) {
        //     navigate('/login');
        // } else {
        //     navigate(-1)
        // }
    }

    return (
        <div className="TitleBar_bar">
            <div className='item'>
                <Button variant="none" style={{ display: backLastPage }} onClick={test}><b><ArrowLeft /></b></Button>
            </div>
            <p className="h2 toptitle TitleBar_toptitle item ">Blockchain Game</p>
            <div className="item"></div>
            {/* <Col xs={3} md={3} >
                <Button variant="none" style={{ display: backLastPage }} onClick={test}><b><ArrowLeft /></b></Button>
            </Col>
            <Col xs={9} md={9}>
                <p className="h2 toptitle TitleBar_toptitle">Bloackchain Game</p>
            </Col> */}
        </div>
    )
}


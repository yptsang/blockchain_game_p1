import './index.css'
import React, { useEffect, useState, useContext } from 'react'
import { Row, Card } from 'react-bootstrap'
import TitleBar from '../../comonents/TitleBar'
import { Context } from '../../context/Context';
import { useNavigate } from 'react-router-dom';

export default function Role(props) {
    const [nodeIsLock, setNodeIsLock] = useState("White");
    const [minerIsLock, setMinerIsLock] = useState("White");
    // Context
    const { userType } = useContext(Context);
    // Navigate
    const navigate = useNavigate();

    useEffect(() => {
        if (userType === "Teacher") {
            setMinerIsLock("grey")
        } else if (userType === "Student") {
            setNodeIsLock("grey")
        } else { }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function toNodehome(e) {
        if (userType === "Teacher") {
            navigate('/nodehome')
        } else { }
    }

    function toMinterhome(e) {
        if (userType === "Student") {
            navigate('/minerhome')
        } else { }
    }

    return (
        <div>

            <TitleBar backLastPage="" lastPageName="" />
            <div className='text-center chooserole'>
                <p className='h3'>Choose your role</p>
            </div>
            <div className='roles'>

                <Row>
                    <div style={{ width: '45%', height: '45%', marginRight: '2.5%', marginLeft: '0.2rem', textDecoration: 'none' }} type='button' onClick={e => toNodehome()}>
                        <Card style={{ width: '100%', height: '100%', borderRadius: '15px', backgroundColor: nodeIsLock }} >
                            <Card.Body className='card_body' >

                                <Card.Text className='text-role text-center mobile-phone' style={{ color: 'black'  }}>
                                    Node
                                </Card.Text>

                            </Card.Body>
                        </Card>
                    </div>
                    <div style={{ width: '45%', height: '45%', marginRight: '2.5%', marginLeft: '0.2rem', textDecoration: 'none' }} type='button' onClick={e => toMinterhome()}>
                        <Card style={{
                            width: '100%', height: '100%', borderRadius: '15px', backgroundColor: minerIsLock
                        }}  >
                            <Card.Body className='card_body'>

                                <Card.Text className='text-role text-center mobile-phone' style={{ color: 'black'}} >
                                    Miner
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </Row>
            </div>
        </div>
    )
}
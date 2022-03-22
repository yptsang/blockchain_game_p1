import React from 'react';
import { Image } from 'react-bootstrap'
import TitleBar from '../../comonents/TitleBar';
import './index.css'
import { useNavigate } from 'react-router-dom';

export default function ScenarioPage() {
    const navigate = useNavigate();

    function toHashcalculation(e) {
        navigate('/hashcalculation')
    }

    return (
        <main>
            <TitleBar backLastPage="" lastPageName="" />
            <br />
            <div className='ScenarioPage_topic'>Case Scenario:</div>
            <br />

            <div className='ScenarioPage_dataBox'>

                <div className='ScenarioPage_dataText'>
                    <p><b>Traceability of wine transactions<br /><br /></b>A Simple PoW Blockchain</p>

                    <p>
                        The presence of blockchain technology revamps the state-of-the-art supply chain traceability systems that are used for tracking and authenticating transactions and shipments along the global supply chain. By doing so, digital transactions can be created and verified in a secure and immutable manner so as to enhance the transparency and visibility of the supply chain activities. <br />
                        <br />
                        Considering that there is a wine supplier in Hong Kong, named as ABC Wines Limited, manages their wine products to several retailers located in different districts of Hong Kong. Customers can place the orders to the retailers everyday, while retailers are responsible for fulfilling the wine demand to end customers. To effectively track and trace the wine transactions between retailers and customers, a blockchain system is developed for the supply chain traceability.
                        <br /><br />
                        In this system, there are two roles:
                    </p>
                    <ul>
                        <li>“Node”: serves as a retailer who accept the customer demand and create the transaction accordingly to the system</li><br />
                        <li>“Miner”: is a peer node who is dedicated to mining the transactions on the blockchain.</li>
                    </ul>
                    <Image src="/BlockchainDiagram.jpg" fluid />
                </div>

            </div>

            <br />

            <div className="ScenarioPage_div_Next">
                <input className="ScenarioPage_btn_Next" type="button" value="Next" onClick={e => toHashcalculation()} />
            </div>

            <br />
        </main>
    )
}
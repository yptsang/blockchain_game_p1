import React from 'react'
import { Button, Image } from 'react-bootstrap'
import TitleBar from '../../comonents/TitleBar';
import { useNavigate } from 'react-router-dom'

export default function HelpPage() {
    const navigate = useNavigate();

    return (
        <div>
            <TitleBar backLastPage="" lastPageName="" />
            <div className='text-center'>
                <p className='h3' style={{ color: '#801E9E', paddingTop: '1rem', paddingBottom: '1rem' }}>How to calculation Hash?</p>
            </div>

            <div className='hash_border'>

                <div className='hash_border_text'>
                    <p><b>The rule of hash Calculation: </b></p>

                    <p>
                        Hash = 10*(A + B + C + D + E) + Prev. Hash (last three digits) + Nonce<br /><br />
                        Nonce = a value between 1 and 21 (to be adjusted to produce a hash that can be completely divided by 3 AND 7)<br />
                        <br />
                        Each block has five data fields (Customer ID, Product ID, Product Quantity, Product Name and Delivery Date).<br />
                        A = Value of the first letter of Customer ID<br />
                        B = Value of the first letter of Product ID<br />
                        C = Value of the Product Quantity<br />
                        D = Value of the first letter of Product Name<br />
                        E = Value of the first two digits (i.e. day) of Delivery Date<br />
                    </p>
                    <Image src="/calculationinfo.png" fluid />
                </div>

            </div>

            <div className='hc_start'>
                <Button variant="none" style={{ width: '100%', color: 'white' }} onClick={() => navigate(-1)}>Back</Button>
            </div>
        </div>
    )

}
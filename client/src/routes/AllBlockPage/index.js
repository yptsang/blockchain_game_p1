import { React, useState, useContext, useEffect } from 'react';
import TitleBar from '../../comonents/TitleBar';
import BlockItem from '../../comonents/BlockItem'
import './index.css'
import { Context } from '../../context/Context';
import { EXPRESS_SERVER_URL } from '../../config';
import axios from '../../axios'
import { useNavigate } from 'react-router-dom';
export default function AllBlockPage() {
    const navigate = useNavigate();
    const { sessionID, setSessionInfo } = useContext(Context);
    const [blocks, setBlocks] = useState("");
    // const [background, setBackGround] = useState('rgb(158, 241, 90)')   rgb(158, 241, 90)
    const [blockHashs, setBlockHashs] = useState([]);
    const [wrongIndex, setWrongIndex] = useState(99);

    const getBlock = async () => {
        try {
            const result = await axios(`${EXPRESS_SERVER_URL}/game1/session/sid/${sessionID}`, { method: 'GET' })
            const json = await result.data
            if (json.status === 0) {
                setBlocks(json.session.blocks)
            }
            json.session.blocks.forEach(block => {
                if (block.bid !== 0) {
                    blockHashs[block.bid] = block.hash;
                }
            })

            setSessionInfo(json.session.info)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        var haveWrong = false;
        for (var i = 1; i < blocks.length; i++) {
            var block = blocks[i];
            if (blockHashs[block.bid] !== block.hash) {
                setWrongIndex(i);
                haveWrong = true;
                break;
            }
        }
        if (!haveWrong) setWrongIndex(99);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockHashs])

    useEffect(() => {
        getBlock();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <main>
            <TitleBar backLastPage="" lastPageName="point" />
            <br />
            <div className='AllBlockPage_topic'>Select One Customer Demand</div>
            <br />
            <div className='AllBlockPage_blocktopic'>Block Index:</div>
            <br />
            <div className='AllBlockPage_BlockList'>
                {/* {ListBlock()} */}
                {blocks ? blocks.map(item => {
                    if (item.bid !== 0) {
                        if (item.bid >= wrongIndex) {
                            return (
                                <BlockItem setBlockHashs={setBlockHashs} background={"rgb(256,180,172)"} key={item.bid} item={item} />
                            )
                        } else {
                            return (
                                <BlockItem setBlockHashs={setBlockHashs} background={"rgb(158, 241, 90)"} key={item.bid} item={item} />
                            )
                        }
                    } else {
                        return null;
                    }
                }) : null}
            </div>
            <br />
            <div className='AllBlockPage_back_div'>
                <input className="AllBlockPage_back_btn" type="button" value="Back" onClick={() => navigate(-1)} />
            </div>
            <br />
        </main>
    )
}
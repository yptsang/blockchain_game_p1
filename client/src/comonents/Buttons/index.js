import React from 'react'
import './index.css'
import { useNavigate } from 'react-router-dom';

export default function BtnShow(props) {
    const navigate = useNavigate();
    var { text, link, css } = props;

    function toNextPage(e) { navigate(link) }

    return (
        <input type="button" onClick={e => toNextPage()} className='btn_bandp' style={{ height: css.h, WebkitBorderRadius: css.r }} value={text} />
    )
}
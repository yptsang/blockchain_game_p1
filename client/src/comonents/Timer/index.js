import React, { useEffect, useContext, useState } from 'react'
import { Context } from '../../context/Context'

export default function Timer(props) {
    const { setTimerStart, tiemrSeconds } = useContext(Context);
    const [min, setMin] = useState(0)
    const [sec, setSec] = useState(0)
    const [overTime, setOverTime] = useState(false)

    useEffect(() => {
        // setTimerStart(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function updateTime() {
        if (tiemrSeconds < 0) {
            setOverTime(true)
            if ((Math.floor(tiemrSeconds / 60) * -1 - 1) < 10) {
                setMin("0" + Math.floor(tiemrSeconds / 60) * -1 - 1)
            } else {
                setMin(Math.floor(tiemrSeconds / 60) * -1 - 1)
            }
            if ((tiemrSeconds % 60) * -1 < 10) {
                setSec("0" + ((tiemrSeconds % 60) * -1))
            } else {
                setSec(tiemrSeconds % 60 * -1)
            }
        } else {
            setOverTime(false)
            if ((Math.floor(tiemrSeconds / 60)) < 10) {
                setMin("0" + Math.floor(tiemrSeconds / 60))
            } else {
                setMin(Math.floor(tiemrSeconds / 60))
            }
            if (tiemrSeconds % 60 < 10) {
                setSec("0" + (tiemrSeconds % 60))
            } else {
                setSec(tiemrSeconds % 60)
            }
        }
    }

    useEffect(() => {
        updateTime()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tiemrSeconds]);

    return (
        <div style={overTime ? { color: "rgb(175, 18, 18)" } : { color: "rgb(19, 185, 44)" }}>{min}:{sec}</div>
    )
}
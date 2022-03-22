import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import './bootstrap.css'
import './App.css'
import axios from './axios'
import { EXPRESS_SERVER_URL, COOKIES_EXPIRES_TIME } from "./config"
import { Context } from './context/Context';
import { socket as socketio } from "./socket"

function App() {
  const [userToken, setLogin] = useState(null)
  const [refreshTokenTimerID, setRefreshTokenTimerID] = useState(null)
  const [userType, setUserType] = useState('')
  const [userInfo, setUserInfo] = useState('')
  const [historyLength, setHistoryLength] = useState(0)
  const [privateID, setPrivateID] = useState('')
  const [sessionID, setSessionID] = useState('')
  const [passcode, setPasscode] = useState('')
  const [tiemrSeconds, setTimerSeconds] = useState(600)
  const [timerid, setTimerId] = useState(null)
  const [timerStart, setTimerStart] = useState(false)
  const [blockDetail, setBlockDetail] = useState(false)
  const [sessionInfo, setSessionInfo] = useState(false)
  const [gameOver, setGameOver] = useState(true)

  const navigate = useNavigate();

  // save info to cookies
  useEffect(() => {
    if (sessionID) {
      Cookies.set('sessionID', sessionID)
    }
  }, [sessionID])
  useEffect(() => {
    if (privateID) {
      Cookies.set('privateID', privateID)
    }
  }, [privateID])
  useEffect(() => {
    if (passcode) {
      Cookies.set('passcode', passcode)
    }
  }, [passcode])
  useEffect(() => {
    if (userInfo) {
      Cookies.set('userInfo', userInfo)
    }
  }, [userInfo])

  useEffect(() => {
    if (historyLength < 0) {
      setHistoryLength(0);
    }
  }, [historyLength])

  useEffect(() => {
    setHistoryLength(historyLength + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname])

  useEffect(() => {
    if (timerStart) {
      clearInterval(timerid)
      const timerSetStart = setInterval(() => {
        setTimerSeconds(pre => pre - 1)
      }, 1000)
      setTimerId(timerSetStart)
    } else if (timerid) {
      clearInterval(timerid)
    }
    return () => {
      if (timerid) {
        clearInterval(timerid)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerStart])

  const checkAccountActivate = async () => {

  }

  useEffect(() => {
    setLogin(Cookies.get('token'));
    setUserType(Cookies.get('userType'));
    setUserInfo(Cookies.get('userInfo'));
    setPrivateID(Cookies.get('privateID'));
    setSessionID(Cookies.get('sessionID'));
    setPasscode(Cookies.get('passcode'));
    setHistoryLength(0);
    if (Cookies.get('sessionID') && Cookies.get('token') && Cookies.get('userInfo')) {
      socketio.emit("activate_game1", { id: Cookies.get('userInfo'), type: Cookies.get('userType'), sid: Cookies.get('sessionID') });
      socketio.emit("join_game1", Cookies.get('sessionID'));
    }
    if (!Cookies.get('token') || Cookies.get('token') === "undefined" || Cookies.get('token') === null) {
      navigate('/login');
    } else if (Cookies.get('userType') === "Teacher") {
      if (Cookies.get('sessionID')) {
        navigate('/scenario');
      } else {
        navigate('/gamesetting');
      }
    } else if (Cookies.get('userType') === "Student") {
      navigate('/scenario');
    }
    async function checkLoginStatus() {
      try {
        const token = Cookies.get('token');
        if (!token || token === "undefined") return;
        const result = await axios(`${EXPRESS_SERVER_URL}/auth`, { method: 'GET' })
        const json = await result.data;
        if (json.status !== 0) {
          setLogin(null)
        } else {
          Cookies.set("token", json.token, { expires: COOKIES_EXPIRES_TIME })
          setLogin(Cookies.get('token'));
        }
      } catch (err) {
        setLogin(null);
        navigate('/login');
      }
    }
    checkLoginStatus();
    const timer = setInterval(checkLoginStatus, 5 * 60 * 1000);
    setRefreshTokenTimerID(timer);
    return () => clearInterval(refreshTokenTimerID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='wrap'>
      {/* <div className='icon_left_div'><img className='icon_left' src="/PolyU_Co-branding_ISE.JPG" alt="" width={'100%'} /></div> */}
      <div className='icon_left_div'><div className='icon_border'>
        <img className='img-fluid' src="/PolyU_logo.jpeg" alt="" width={'100%'} />
        <img className='img-fluid icon_left_X' src="/ISE_logo.jpeg" alt="" width={'59.7%'} />
        </div></div>
      <div className='main'>
        <Context.Provider value={{
          setHistoryLength: setHistoryLength,
          historyLength: historyLength,
          setLogin: setLogin,
          setUserType: setUserType,
          userToken: userToken,
          userType: userType,
          setUserInfo: setUserInfo,
          userInfo: userInfo,
          setPrivateID: setPrivateID,
          // eslint-disable-next-line no-dupe-keys
          privateID, privateID,
          setSessionID: setSessionID,
          sessionID: sessionID,
          passcode: passcode,
          setPasscode: setPasscode,
          socket: socketio,
          setTimerSeconds: setTimerSeconds,
          tiemrSeconds: tiemrSeconds,
          setTimerStart: setTimerStart,
          blockDetail: blockDetail,
          setBlockDetail: setBlockDetail,
          sessionInfo: sessionInfo,
          setSessionInfo: setSessionInfo,
          gameOver: gameOver,
          setGameOver: setGameOver
        }}>
          <Outlet />
        </Context.Provider>
      </div>

      <div className='icon_right_div'><div className='icon_border'><img className='img-fluid' alt="" src="/SCM_HSU_short.png" width={'100%'} /></div></div>
      {/* <div className='icon_right_div'><img className='icon_right' alt="" src="/SCM_HSU_short.png" width={'100%'} /></div> */ }
    </div >
  );


}

export default App;

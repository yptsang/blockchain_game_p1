import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import LoginPage from './routes/LoginPage/index';
import RolePage from './routes/RolePage/index';
import HashCalculationPage from './routes/HashCalculationPage';
import ScenarioPage from './routes/ScenarioPage';
import GameSettingPage from './routes/GameSettingPage'
import NodeHomePage from './routes/NodeHomePage'
import NodeDashboardPage from './routes/NodeDashboardPage'
import DataUploadPage from './routes/DataUploadPage'
import BlockDataPage from './routes/BlockDataPage'
import ChainedBlockDetailPage from './routes/ChainedBlockDetailPage'
import MinerDashboardPage from './routes/MinerDashboardPage'
import AllBlockPage from './routes/AllBlockPage'
import HashBoardWaitingPage from './routes/HashBoardWaitingPage'
import VerificationPage from './routes/VerificationPage'
import PointPage from './routes/PointPage'
import HelpPage from './routes/HelpPage';
import MinerHome from './routes/MinerHomePage';
import CalculateHashPage from './routes/CalculateHashPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes onChange={() => { console.log("test") }}>
        <Route path="/" element={<App />} >
          <Route path="/login" element={<LoginPage />} />
          <Route path="/point" element={<PointPage />} />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path="/hashboardwaiting" element={<HashBoardWaitingPage />} />
          <Route path="/allblock" element={<AllBlockPage />} />
          <Route path="/minerdashboard" element={<MinerDashboardPage />} />
          <Route path="/chainedblockdetail" element={<ChainedBlockDetailPage />} />
          <Route path="/blockdata" element={<BlockDataPage />} />
          <Route path="/dataupload" element={<DataUploadPage />} />
          <Route path="/gamesetting" element={<GameSettingPage />} />
          <Route path="/nodehome" element={<NodeHomePage />} />
          <Route path="/nodedashboard" element={<NodeDashboardPage />} />
          <Route path="/role" element={<RolePage />} />
          <Route path="/scenario" element={<ScenarioPage />} />
          <Route path="/hashcalculation" element={<HashCalculationPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/minerhome" element={<MinerHome />} />
          <Route path="/calculatehash" element={<CalculateHashPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import NavBar from './components/views/NavBar/NavBar';
import TopPannel from './components/views/TopPannel/TopPannel';
import BoardlistPage from './components/views/BoardPage/BoardlistPage';
import BoardunitPage from './components/views/BoardPage/BoardunitPage';
import { Divider } from 'antd';
import BoardwritePage from './components/views/BoardPage/BoardwritePage';
import NotePage from './components/views/NotePage/Note';
import SendNote from './components/views/NotePage/SendNote';
import Auth from './hoc/auth';
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <Router>
    <div>
      {/*
        A <Switch> looks through all its children <Route>
        elements and renders the first one whose path
        matches the current URL. Use a <Switch> any time
        you have multiple routes, but you want only one
        of them to render at a time
      */}
      <TopPannel />
      <Divider />
      <NavBar />
      <Divider />
        <Routes>
          {/*
          각 페이지마다 로그인 여부를 확인하기 위해 Auth(페이지, 로그인상태, 어드민권한)활용
          로그인상태가 false이면 로그인 한 경우에는 접근 불가, null은 상관없음, true은 로그인해야 접근 가능
          */}
          <Route exact path="/" element={Auth(LandingPage, null)}/>
          <Route path="/login" element={Auth(LoginPage, false)}/>
          <Route path="/register" element={Auth(RegisterPage, false)}/>
          <Route path="/board" element={Auth(BoardlistPage, null )}/>
          <Route path="/board/:id" element={Auth(BoardunitPage, null)}/>
          <Route path="/board/write" element={Auth(BoardwritePage, true)}/>
          <Route path="/note" element={Auth(NotePage, true)}/>
          <Route path="/sendnote" element={Auth(SendNote, true)}/>
        </Routes>
    </div>
  </Router>
  );
}




export default App; 

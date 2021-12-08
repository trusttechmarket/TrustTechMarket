import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import NavBar from './components/views/NavBar/NavBar';
import TopPannel from './components/views/TopPannel/TopPannel';
import BoardlistPage from './components/views/BoardPage/BoardlistPage';
import { Divider } from 'antd';
import BoardwritePage from './components/views/BoardPage/BoardwritePage';

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
      <Routes>
        <Route exact path="/" element={<LandingPage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/board" element={<BoardlistPage />}/>
        <Route path="/board/update" element={<BoardwritePage />}/>
      </Routes>
    </div>
  </Router>
  );
}




export default App; 

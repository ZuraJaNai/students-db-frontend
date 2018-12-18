import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from 'react-router-dom';
import Main from './Components/Main.jsx';
import Header from './Components/Header.jsx';

ReactDOM.render((
    <HashRouter>
        <div>
            <Header />
            <Main />
        </div>
    </HashRouter>
  ),  
document.getElementById('content'));
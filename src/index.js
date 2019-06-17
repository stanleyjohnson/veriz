import React from 'react'
import ReactDOM from 'react-dom'
import Greetings from "./hello.js";

window.onload = function(){
    ReactDOM.render(
        React.createElement(Greetings, { name : 'Chris' }),
        document.getElementById('root')
    );
}

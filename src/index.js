import Greetings from "./hello.js";

window.onload = function(){
    ReactDOM.render(
        <Greetings name='Chris'/>,
        document.getElementById('root')
    );
}

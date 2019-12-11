import Greetings from "./hello.js";

window.onload = function(){
    mount(
        <Greetings name='Chris'/>,
        document.getElementById('root')
    );
}


// autoConnect is set to false so the connection is not established right away. 
// We will manually call socket.connect() once we specify the username.
const socket = io('ws://localhost:3001', { autoConnect: false });
const username = localStorage.getItem('username');
socket.auth = { username: username };
socket.connect();

console.log(username);

socket.on('message', text => {

    const el = document.createElement('li');
    el.innerHTML = text;
    document.querySelector('ul').appendChild(el)

});

document.querySelector('button').onclick = () => {

    const text = document.getElementById('message').value;
    const matchedUsername = document.getElementById('matchedUsername').value;
    socket.emit('message', {"matchedUsername": matchedUsername, "content": text})
    
}

const socket = io('http://localhost:3000');

let name = prompt('What is your name?');

socket.emit('login', name);

socket.on('list-user', data => {
    showListUser(data)
})

socket.on('user-connected', data => {
    showListUser(data)
})

socket.on('user-disconnected', data => {
    showListUser(data)
})


function showListUser(users) {
    $('#users-show').empty();
    let html = '';
    users.forEach((user, index) => {
        html += '<li>';
        html += `<span class="presence" style="background-color: ${user.color}"></span>`;
        html += `<span>${user.name}</span>`;
        html += '</li>';
        console.log(user)
    });
    $('#users-show').append(html)
}
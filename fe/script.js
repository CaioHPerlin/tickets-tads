const API_URL = 'http://localhost:3000';

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const ticketSection = document.getElementById('ticket-section');
const ticketForm = document.getElementById('ticket-form');
const ticketList = document.getElementById('ticket-list');
const registerMessage = document.getElementById('register-message');
const loginMessage = document.getElementById('login-message');
const ticketMessage = document.getElementById('ticket-message');
const logoutButton = document.getElementById('logout-btn')

registerForm.addEventListener('submit', register);
loginForm.addEventListener('submit', login);
ticketForm.addEventListener('submit', addTicket);

logoutButton.addEventListener('click', logout);

checkToken();

function updateDOMLogin() {
    loginMessage.textContent = '';
    registerForm.style.display = 'none';
    loginForm.style.display = 'none';
    ticketSection.style.display = 'block';
    loadTickets();
}

function updateDOMLogout() {
    registerForm.style.display = 'block';
    loginForm.style.display = 'block';
    ticketSection.style.display = 'none';
}

function checkToken() {
    if(localStorage.getItem('token') != null){
        updateDOMLogin();
    }
}

async function register(e) {
    e.preventDefault();

    const name = document.querySelector('#rg-name').value;
    const email = document.querySelector('#rg-email').value;
    const password = document.querySelector('#rg-password').value;

    fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    }).then(res => {
        if (!res.ok) {
            return Promise.reject(res);
        }
        return res.json();
    }).then(res => {
        if (res.name) {
            registerMessage.textContent = 'usuário ' + res.name + ' criado com sucesso!'
        }
    }).catch(res => {
        res.json().then(err => {
            registerMessage.textContent = err.message;
        })
    })
}

async function login(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    }).then(res => {
        if (!res.ok) {
            return Promise.reject(res);
        }
        return res.json();
    }).then(res => {
        if (res.auth && res.token) {
            localStorage.setItem('token', res.token);
        }
        updateDOMLogin();
    }).catch(res => {
        res.json().then(err => {
            loginMessage.textContent = err.message;
        })
    })
}

async function logout() {
    localStorage.clear('token');
    updateDOMLogout();
}

async function loadTickets() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/tickets`, {
            headers: {
                'x-access-token': '' + token
            },
        });

        const { tickets } = await response.json();
        ticketList.innerHTML = '';
        tickets.forEach(ticket => {
            const li = document.createElement('li');
            li.textContent = `Título: ${ticket.title}, Descrição: ${ticket.description}, Data de Abertura: ${ticket.openingDate}, Resolvido: ${ticket.resolved}`;
            ticketList.appendChild(li);
        });
    } catch (error) {
        ticketMessage.textContent = error.message;
    }
}

async function addTicket(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const resolved = document.getElementById('resolved').checked;

    try {
        const response = await fetch(`${API_URL}/tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': '' + token
            },
            body: JSON.stringify({
                title,
                description,
                openingDate: date,
                resolved
            })
        });

        const ticket = await response.json();
        ticketMessage.textContent = `Ticket cadastrado com sucesso: ${ticket.title}`;
        await loadTickets();
    } catch (error) {
        ticketMessage.textContent = error.message;
    }
}
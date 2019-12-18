/* eslint-disable no-shadow */
const status = document.getElementById('status');
const messages = document.getElementById('messages');
const form = document.getElementById('form');
const email = document.getElementById('input1');
const passwordHash = document.getElementById('input2');

const ws = new WebSocket('ws://localhost:8080');

const setStatus = value => {
  status.innerHTML = value;
};

const printMessage = value => {
  const li = document.createElement('li');

  li.innerHTML = value;
  messages.appendChild(li);
};

ws.onopen = () => setStatus('ONLINE');
ws.onclose = () => setStatus('DISCONNECTED');
ws.onmessage = response => printMessage(response.data);

const auth = function(email, passwordHash) {
  return fetch('http://localhost:3000/auth/login', {
    body: JSON.stringify({
      email,
      passwordHash,
    }),
    headers: { 'Content-type': 'application/json' },
    method: 'POST',
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);

      return data;
    })
    .catch(error => console.log(error));
};

form.addEventListener('submit', e => {
  e.preventDefault();
  auth(email.value, passwordHash.value).then(data => {
    const message = {
      type: 'SUBSCRIBE',
      id: data.id,
    };

    ws.send(JSON.stringify(message));
    email.value = '';
    passwordHash.value = '';
  });
});



/* eslint-disable no-shadow */
const form = document.getElementById('form2');
const id = document.getElementById('id');
const text = document.getElementById('text');

const sendText = function(id, text) {
  return fetch('/send-message', {
    body: JSON.stringify({
      id,
      text,
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
  sendText(id.value, text.value).then(() => {
    id.value = '';
    text.value = '';
  });
});


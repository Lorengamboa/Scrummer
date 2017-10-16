!(function(){
  const electron = require('electron');
  const {
    ipcRenderer
  } = electron;

  document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents from submitting itself

    const inputs = document.getElementsByTagName('input');
    const details = {
      'title': inputs[0].value,
      'content': inputs[1].value,
      'priority': inputs[2].value,
      'state': 'todo'
    }
    ipcRenderer.send('note:create', details);
  });
})();

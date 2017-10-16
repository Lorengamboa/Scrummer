!(function() {
  const electron = require('electron');
  const {
    ipcRenderer,
    remote
  } = electron;
  const {
    note_details,
    note_id
  } = remote.getCurrentWindow();

  document.getElementById("title").value = note_details.title;
  document.getElementById("content").value = note_details.content;
  document.getElementById("priority").value = note_details.priority;

  document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents from submitting itself
    const inputs = document.getElementsByTagName('input');
    const details = {
      'id': note_id,
      'title': inputs[0].value,
      'content': inputs[1].value,
      'priority': inputs[2].value
    }
    ipcRenderer.send('note:modify', details);
  });

  document.getElementById("delete").addEventListener('click', (event) => {
    ipcRenderer.send('note:delete', note_id);
  });
})();

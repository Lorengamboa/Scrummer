!(function() {

  const electron = require('electron');
  const { ipcRenderer, remote } = electron;
  const { note_details, note_id } = remote.getCurrentWindow();

  /*
    Sets the value of the following inputs
   */
  document.getElementById("title").value = note_details.title;
  document.getElementById("content").value = note_details.content;
  document.getElementById("priority").value = note_details.priority;

  // Triggers event in case the modify button is clicked
  document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents from submitting itself
    const inputs = document.getElementsByTagName('input');
    const ta = document.getElementsByTagName('textarea');

    const details = {
      'id': note_id,
      'title': inputs[0].value,
      'content': ta[0].value,
      'priority': inputs[1].value
    }
    ipcRenderer.send('note:modify', details);
  });

  // Triggers event in case the delete button is clicked
  document.getElementById("delete").addEventListener('click', (event) => {
    ipcRenderer.send('note:delete', note_id);
  });

})();

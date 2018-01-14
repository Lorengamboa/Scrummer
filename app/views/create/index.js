!(function() {

  const electron = require('electron');
  const { ipcRenderer } = electron;

  // Triggers event in case the create button is clicked
  document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents from submitting itself

    const inputs = document.getElementsByTagName('input');
    const ta = document.getElementsByTagName('textarea');
    // Populates details object with the note specifications
    const details = {
      'title': inputs[0].value,
      'content': ta[0].value,
      'priority': inputs[1].value,
      'state': 'todo'
    }

    ipcRenderer.send('note:create', details);
  });

})();

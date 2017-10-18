!(function() {

  const electron = require('electron');
  const { ipcRenderer } = electron;

  // Triggers event in case the create button is clicked
  document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents from submitting itself

    const inputs = document.getElementsByTagName('input');
    // Populates details object with the note specifications
    const details = {
      'title': inputs[0].value,
      'content': inputs[1].value,
      'priority': inputs[2].value,
      'state': 'todo'
    }

    ipcRenderer.send('note:create', details);
  });

})();

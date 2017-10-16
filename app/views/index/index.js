;(function() {

  // Imports needed modules
  const electron = require('electron');
  const {
    ipcRenderer,
    remote
  } = electron;
  const {
    initialNotes
  } = remote.getCurrentWindow();

  var btn_settings = document.getElementsByClassName("settings");

  //
  updateNotes(initialNotes);

  // Opens create note window
  document.getElementById('create-note').addEventListener('click', (ev) => {
    ipcRenderer.send('open-window:create', () => {});
  });

  for (var i = 0; i < btn_settings.length; i++) {
    btn_settings[i].addEventListener('click', openModifyWindow, false);
  }

  // Updates the notes, propably becouse of a crud operation
  ipcRenderer.on('update:notes', (ev, notes) => {
    updateNotes(notes);
  });


  var drake =
    dragula([document.querySelector('#todo-list'),
      document.querySelector('#progress-list'),
      document.querySelector('#done-list')
    ], {
      direction: 'vertical',
      copy: false,
      copySortSource: false,
      revertOnSpill: false,
      removeOnSpill: false,
      mirrorContainer: document.body,
      ignoreInputTextSelection: true
    });

  drake.on('drop', (el, target, source, sibling) => {
    //console.log("dropped!",el,target,source,sibling);
    if (target.id === source.id) return; // In case the note is dropped in the same section

    const idcard = el.id;
    var nstate;

    switch (target.id) {
      case "todo-list":
        nstate = "todo"
        break;
      case "progress-list":
        nstate = "progress"
        break;
      case "done-list":
        nstate = "done"
        break;
      default:
        nstate = "todo"
    }

    setStateCard(idcard, nstate);
  });

  //
  function setStateCard(index, nState) {
    var details = {
      index,
      nState
    };
    ipcRenderer.send('card:updatestate', (details));
  }

  // Updates the screen populating it with all notes created
  function updateNotes(initialNotes) {
    cleanNotes();
    initialNotes.forEach((el, index) => {
      addStickNote(el, index);
    });
  }

  // Cleans all the notes
  function cleanNotes() {
    document.getElementById('todo-list').innerHTML = "";
  }

  // Adds an single note to the screen
  function addStickNote(details, index) {
    const div = document.createElement('div');
    const ul = document.createElement('ul');
    const i = document.createElement('i');

    i.appendChild(document.createTextNode("settings"));
    i.className = "tiny material-icons settings";

    const title = document.createElement('li');
    title.appendChild(document.createTextNode(details.title));
    const content = document.createElement('li');
    content.appendChild(document.createTextNode(details.content));

    ul.appendChild(title);
    ul.appendChild(content);

    div.id = index;
    div.className = `col s6 postit lvl${details.priority}`;
    div.appendChild(ul);
    div.appendChild(i);


    switch (details.state) {
      case "todo":
        document.getElementById('todo-list').appendChild(div);
        break;
      case "progress":
        document.getElementById('progress-list').appendChild(div);
        break;
      case "done":
        document.getElementById('done-list').appendChild(div);
        break;
    }
  }

  function openModifyWindow(ev) {
    const id = ev.target.offsetParent.id;
    ipcRenderer.send('open-window:modify', id);
  };

})();

"use strict";

const { BrowserWindow } = require('electron');
const { DIR_CREATE_HTML, DIR_MODIFY_HTML } = require('../conf/constants');

/**
 * Opens the create note window
 */
exports.openCreateNoteWindow = (window) => {
  window.loadURL(`file://${__dirname}${DIR_CREATE_HTML}`);
  window.on('closed', () => window = null); //Garbage Collection, save memory
}

/**
 * Opens the modify window
 */
 exports.openModifyNoteWindow = (window, store, id) => {
   window.note_id = id;
   window.note_details = store.get(id);
   window.loadURL(`file://${__dirname}${DIR_MODIFY_HTML}`);
   window.on('closed', () => window = null); //Garbage Collection, save memory
 }

/**
 * Updates the main index.html view
 */
exports.updatesMainWindow = (window, store) => {
  const allNotes = store.getAll();
  window.webContents.send('update:notes', allNotes);
}

"use strict";

const { openCreateNoteWindow } = require('../utils/windows');
const {
  SHORCUT_QUIT_IOS,
  SHORCUT_QUIT_WN,
  SHORCUT_CONSOLE_WN,
  SHORCUT_CONSOLE_IOS
} = require('./constants');

// Menu core properties
const main_menu = [{
  label: 'options',
  submenu: [{
      label: 'Create a new note',
      accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
      click() {
        openCreateNoteWindow();
      }
    },
    {
      role: 'quit'
    }
  ]
}]

// Menu developer mode
const menu_dev = {
  label: 'View',
  submenu: [
    { role: 'reload' },
    {
      label: 'Toogle developer tools',
      accelerator: process.platform === 'darwin' ? SHORCUT_CONSOLE_IOS : SHORCUT_CONSOLE_WN,
      click(item, focusedWindow) {
        focusedWindow.toggleDevTools();
      }
    }
  ]
}


module.exports.main_menu = main_menu;
module.exports.menu_dev = menu_dev;

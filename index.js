"use strict";

// Import modules
const path = require('path');
const electron = require('electron');
const Store = require('./app/utils/store');
const { openCreateNoteWindow, openModifyNoteWindow, updatesMainWindow } = require('./app/utils/windows');
const { mainWindowSettings, createWindowSettings, modifyWindowSettings } = require('./app/conf/windows');
const { DIR_MAIN_HTML, DIR_CREATE_HTML, DIR_MODIFY_HTML, NAME_DB_NOTES } = require('./app/conf/constants');
const { main_menu, menu_dev } = require('./app/conf/menu');
const { app, BrowserWindow, ipcMain, Menu, Tray } = electron;

let mainWindow, createWindow, modifyWindow; // Windows available
let tray;

// Store variable
let store = new Store({
    configName: NAME_DB_NOTES,
    defaults: []
  });

// Once app is ready
app.on('ready', () => {
  mainWindow = new BrowserWindow(mainWindowSettings);
  mainWindow.initialNotes = store.getAll();
  mainWindow.maximize();
  mainWindow.loadURL(`file://${__dirname}${DIR_MAIN_HTML}`);
  mainWindow.on('closed', () => closeApp()); // If main window is closed,
                                            // the entire app will shutdown

  const mainMenu = Menu.buildFromTemplate(main_menu);
  Menu.setApplicationMenu(mainMenu);

  const iconName = process.platform === 'win32' ? 'tray.ico' : 'tray.ico';
  const iconPath = path.join(__dirname, `./app/assets/img/ico/${iconName}`);
  tray = new Tray(iconPath);
});

// Listens to the ipc and opens the create note window
ipcMain.on('open-window:create', (event) => {
  openCreateNoteWindow(createWindow, createWindowSettings);
});

// Listens to the ipc and opens the create note window
ipcMain.on('open-window:modify', (event, id) => {
  openModifyNoteWindow(modifyWindow, createWindowSettings, store, id);
});

// Sends the new note details and adds it to the mainWindow
ipcMain.on('note:create', (event, details) => {
  // Adds new note object to the db
  store.set(details);
  updatesMainWindow(mainWindow, store)
});

// Updates the values from an existing note
ipcMain.on('note:modify', (event, details) => {
  store.updateCard(details);
  updatesMainWindow(mainWindow, store)
});

// Sends the new note details and adds it to the mainWindow
ipcMain.on('card:updatestate', (event, details) => {
  // Adds new note object to the db
  store.updateCardState(details);
  //updatesMainWindow()
});

// Sends the new note details and adds it to the mainWindow
ipcMain.on('note:delete', (event, id) => {
  // Adds new note object to the db
  store.delete(id);
  //updatesMainWindow()
});

//  Cross platform, darwin is what ios is build upon on
if (process.platform === 'darwin') {
  main_menu.unshift({});
}

// show developer tool if we are not in productions stage
if ( process.env.NODE_ENV !== 'production') {
  main_menu.push(menu_dev)
}

/**
 * Shutdowns the whole application
 */
function closeApp() {
  app.quit();
}

"use strict";

// Import modules
const path = require('path');
const electron = require('electron');
const MainWindow = require('./app');
const Store = require('./app/utils/store');
const MainTray = require('./app/utils/tray');

const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  Tray
} = electron;
const {
  openCreateNoteWindow,
  openModifyNoteWindow,
  updatesMainWindow
} = require('./app/utils/windows');
const {
  createWindowSettings,
  modifyWindowSettings
} = require('./app/conf/windows');
const {
  DIR_MAIN_HTML,
  DIR_CREATE_HTML,
  DIR_MODIFY_HTML,
  NAME_DB_NOTES
} = require('./app/conf/constants');
const {
  storeSettings
} = require('./app/conf/general');
const {
  main_menu,
  menu_dev
} = require('./app/conf/menu');

let mainWindow, createWindow, modifyWindow; // Windows
let mainTray;

// Store variable
let store = new Store(storeSettings);

// Once app is ready
app.on('ready', () => {
  mainWindow = new MainWindow(`file://${__dirname}${DIR_MAIN_HTML}`);
  mainWindow.initialNotes = store.getAll();

  const mainMenu = Menu.buildFromTemplate(main_menu);
  Menu.setApplicationMenu(mainMenu);

  const iconName = process.platform === 'win32' ? 'icon.ico' : 'icon.png';
  const iconPath = path.join(__dirname, `./app/assets/img/ico/${iconName}`);
  mainTray = new MainTray(iconPath, mainWindow);

  //  Cross platform, darwin is what ios is build upon on
  if (process.platform === 'darwin') {
    main_menu.unshift({});
  }

  // show developer tool if we are not in productions stage
  if (process.env.NODE_ENV !== 'production') {
    main_menu.push(menu_dev)
  }

});

// Listens to the ipc and opens the create note window
ipcMain.on('open-window:create', (event) => {
  createWindow = new BrowserWindow(createWindowSettings);
  openCreateNoteWindow(createWindow);
});

// Sends the new note details and adds it to the mainWindow
ipcMain.on('note:create', (event, details) => {
  // Adds new note object to the db
  store.set(details);
  updatesMainWindow(mainWindow, store);
  createWindow.close();
});

// Listens to the ipc and opens the create note window
ipcMain.on('open-window:modify', (event, id) => {
  modifyWindow = new BrowserWindow(createWindowSettings);
  openModifyNoteWindow(modifyWindow, store, id);
});

// Updates the values from an existing note
ipcMain.on('note:modify', (event, details) => {
  store.updateCard(details);
  updatesMainWindow(mainWindow, store);
  modifyWindow.close();
});

// Sends the new note details and adds it to the mainWindow
ipcMain.on('note:delete', (event, id) => {
  // Adds new note object to the db
  store.delete(id);
  updatesMainWindow(mainWindow, store);
  modifyWindow.close();
});

// Sends the new note details and adds it to the mainWindow
ipcMain.on('card:updatestate', (event, details) => {
  // Adds new note object to the db
  store.updateCardState(details);
  //updatesMainWindow()
});

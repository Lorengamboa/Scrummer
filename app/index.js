"use strict";

const electron = require('electron');
const { BrowserWindow } = electron;
const { mainWindowSettings } = require('./conf/windows');

class MainWindow extends BrowserWindow {
  constructor(url){
    super(mainWindowSettings);
    this.loadURL(url);
    //this.on('blur', this.onBlur);
    this.maximize();
  }
  /*/
  onBlur() {
    this.hide();
  }*/
}

module.exports = MainWindow;

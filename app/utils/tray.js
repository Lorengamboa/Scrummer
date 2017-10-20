"use strict";

const electron = require('electron');
const { Tray, app, Menu } = electron;
const { tray_menu } = require('../conf/menu');

/**
 *
 *
 */
class MainTray extends Tray {
  constructor(iconPath, mainWindow) {
    super(iconPath);
    this.mainWindow = mainWindow;
    this.setToolTip('TimerApp');
    this.on('click', this.onClick);
    this.on('right-click', this.onRightClick);
  }

  //
  onClick() {
    if(this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      this.mainWindow.show();
    }
  }

  //
  onRightClick() {
    this.popUpContextMenu(tray_menu);
  }
}

module.exports = MainTray;

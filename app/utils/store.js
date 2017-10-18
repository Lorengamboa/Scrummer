"use strict";

// I got part of the following code from the following site
// https://gist.github.com/ccnokes/95cb454860dbf8577e88d734c3f31e08#file-store-js

// Import modules
const path = require('path');
const fs = require('fs');
const electron = require('electron');

class Store {
  constructor(opts) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    this.path = path.join(userDataPath, opts.configName + '.json');
    this.data = parseDataFile(this.path, opts.defaults); // In case the db hasn't been created until now
    console.log(this.path);
  }

  /**
   * Retreives a specific note
   * @param  {number} key Note's ID
   * @return {object}     A note
   */
  get(key) {
    return this.data[key];
  }

  /**
   * Indexes a new note
   * @param {object} val details of the note created
   */
  set(val) {
    this.data.push(val);
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  /**
   * Retreives all the notes
   * @return {List Object} List of notes
   */
  getAll() {
    return this.data;
  }

  /**
   * Total number of notes
   * @return {number} number of notes
   */
  getCount() {
    return this.data.length;
  }

   /**
    * Updates the current value of the different
    * details that contains a specific card
    */
  updateCard(details) {
    const { id, title, content, priority } = details;
    this.data[id].title = title;
    this.data[id].content = content;
    this.data[id].priority = priority;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  /**
   * Updates the state of the card (todo, progress, done)
   * @param  {object} details details to change the state of the card
   */
  updateCardState(details) {
    const { index, nState } = details;
    this.data[index].state = nState;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  /**
   * Deletes a specific note
   */
  delete(idcard){
    this.data.splice(idcard, 1);
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  deleteAll(){}
}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    return defaults;
  }
}

// expose the class
module.exports = Store;

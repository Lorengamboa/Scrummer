const { Application } = require('spectron');
const path = require('path');

const electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');
const appPath = path.join(__dirname, '..');

const app = new Application({
  path: electronPath,
  args: [appPath]
});

const todoText = 'test something';

beforeAll(() => app.start())

afterAll(() => {
  if (app && app.isRunning()) {
    return app.stop();
  }
});

test('When I click the button, a new window is open', () => {
  return app.client.waitUntilWindowLoaded().then(() => {
    return app.client.click('#create-note').then(() => {
      return app.client.getWindowCount().then(count => {
        return expect(count).toBe(2);
      });
    });
  });
});

test('I can enter a title, click create the window should close', () => {
  return app.client.windowByIndex(1).then(() => {
    return app.client.setValue('#title', todoText).then(() => {
      return app.client.click('button[type=submit]').then(() => {
        return app.client.getWindowCount().then(count => expect(count).toBe(1));
      });
    });
  });
});

// holder for the note index that will be created
let noteIndex = 0;

test('I should now see the todo listed', () => {
  const ex = new RegExp(todoText);
  const expected = expect.stringMatching(ex);
  
  return app.client.windowByIndex(0).then(() => {
    return app.client.getText('#todo-list .postit').then(todos => {
      if (Array.isArray(todos)) {
        noteIndex = todos.findIndex((value, id) => ex.test(value))
        
        return expect(todos).toContainEqual(expected);
      }
      
      return expect(todos).toEqual(expected);
    });
  });
});

test('I should be able to delete the todo', () => {
  return app.client.click(`#todo-list .postit[id="${noteIndex}"] i.settings`).then(() => {
    return app.client.getWindowCount().then(count => {
      expect(count).toBe(2);
      
      return app.client.windowByIndex(1).then(() => {
        return app.client.click('#delete').then(() => {
          return app.client.getWindowCount().then(() => {
            return app.client.getWindowCount().then(count => expect(count).toBe(1));
          })
        })
      });
    });
  });
});


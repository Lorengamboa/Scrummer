const { Application } = require('spectron');
const path = require('path');

const electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');
const appPath = path.join(__dirname, '..');

const app = new Application({
  path: electronPath,
  args: [appPath]
});

beforeAll(() => app.start())

afterAll(() => {
  if (app && app.isRunning()) {
    return app.stop();
  }
});

test('When Run a window should open', function () {
  app.client.getWindowCount().then(count => expect(count).toEqual(1));
});

test('should show text, to do, in progress, and done', () => {
  return app.client.waitUntilWindowLoaded().then(
    () => app.client.getText('.section-title').then(
      titles => expect(titles).toEqual(
        expect.arrayContaining(['TO DO', 'IN PROGRESS', 'DONE'])
      )));
});

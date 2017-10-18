const { mainWindowSettings, createWindowSettings } = require('../windows');

test('mainWindowSettings', () => {
  expect(mainWindowSettings).toMatchSnapshot();
});

test('createWindowSettings', () => {
  expect(createWindowSettings).toMatchSnapshot();
});
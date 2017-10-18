const constants = require('../constants');

test('constants should be defined', () => {
  expect(constants).toMatchSnapshot();
});

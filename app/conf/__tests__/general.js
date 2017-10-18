const general = require('../general');
const { NAME_DB_NOTES } = require('../constants');

test('conf/general', () => {
  expect(general.storeSettings).toEqual(expect.objectContaining({
    configName: expect.stringContaining(NAME_DB_NOTES),
    defaults: expect.any(Array)
  }));
});
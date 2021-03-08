const MapsApi = require('./MapsAPI.queries');

const mapsApi = MapsApi();

describe('MapsApi', () => {
  test('should return autoComplete response ', () => {
    mapsApi.placesAutoComplete({ input: 'Amsterdam' }).then(result => {
      expect(result.json.predictions[0].description).toBe(true);
    }); 
  });
});

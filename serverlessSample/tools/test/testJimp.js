// node tools/test/testJimp

require('../../src/global');
const Promise = require('bluebird');
const Jimp = require('jimp');
const tokenParser = require('libs/weather/tokenParser');
const request = require('libs/request');

console.log('testJimp start!');

  // http://zenith-ms.accu-weather.com/nmigs/zenith-ms.aspx?mx=-87.83&my=42.04&geowidth=100&geounit=mi&imagewidth=568&imageheight=426&Imagesource=US_SIR&layers=1110011110111101&token=zenith-ms.accu-weather.com0123456789012345678901234567
  const params = {
    mx: -87.83,
    my: 42.04,
    geowidth: 100,
    geounit: 'mi',
    imagewidth: 568,
    imageheight: 426,
    Imagesource: 'US_SIR',
    layers: '1110011110111101',
    token: 'zenith-ms.accu-weather.com0123456789012345678901234567'
};

Promise.resolve().then(async() => {
  /* using axios */
  const data = await request.getBuffer('WEATHER', '/nmigs/zenith-ms.aspx', params);
  const image = await Jimp.read(data);
  const buffer = await image.getBufferAsync('image/png');

  /* using url */
  // const url = 'http://zenith-ms.accu-weather.com/nmigs/zenith-ms.aspx';
  // const paramString = _.map(params, (value, key) => encodeURIComponent(key) + '=' + encodeURIComponent(value)).join('&');
  // const image = await Jimp.read(`${url}?${paramString}`);
  // const buffer = await image.getBufferAsync("image/png");

    console.log('testJimp finish!');
}).catch(err => {
    console.error(`Error : ${err.message}`);
});

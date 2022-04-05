// xml api (http://zenith-ms.accu-weather.com/nmigs/acx.aspx?cb=1605068139708) to token
// node tools/test/parseToken
/*
return token
zenith-ms.accu-weather.com0123456789012345678901234567
*/

require('../../src/global');
const tokenParser = require('libs/weather/tokenParser');
const Promise = require('bluebird');

console.log('parseToken start!');

const xml = `
<?xml version="1.0" encoding="utf-8"?>
<nmigs_request>
    <acx>102m3o4c5.6r7e8h9t0a1e2w3-4u5c6c7a8.9s0m1-2h3t4i5n6e7z</acx>
</nmigs_request>
`;

Promise.resolve().then(async() => {
    const ret = await tokenParser.parse(xml);
    console.log(ret);
    console.log('parseToken finish!');
}).catch(err => {
    console.error(`Error : ${err.message}`);
});

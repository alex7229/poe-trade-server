const request = require('request');
const fs = require('fs');


request('http://poe.trade/search/awiwariinotatu', function (error, response, body) {
   fs.writeFileSync('test.html', body)
});

const express = require('express');
const request = require('request');
const app = express();

app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.get('/', function (req, res) {
    res.send('Hello World')
});

app.use('/api/proxy', function (req, res) {
    request(req.body.url, (error, response, data) => {
        if (error) {
            res.send('some error occurred. Check node prompt');
            throw error;
        }
        res.send(data);
    })
});

app.listen(3000, function () {
    console.log('Server is started')
});

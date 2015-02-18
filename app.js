var express = require('express');
var app = express();

app.set('view engine', 'hjs');

app.get('/', function (req, res) {
    res.render('stage1', {
        test: 'Hello world'
    });
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
var express = require('express');
var app = express();

app.set('view engine', 'hjs');

app.get('/', function (req, res) {
    res.redirect('stage1')
});

app.get('/stage1', function (req, res) {
    res.render('stage1', {
        test: 'Stage 1'
    });
});

app.get('/stage2', function (req, res) {
    res.render('stage2', {
        test: 'Stage 2'
    });
});

app.get('/stage3', function (req, res) {
    res.render('stage3', {
        test: 'Stage 3'
    });
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
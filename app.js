var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session')

var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(session({
    secret: '1234567890QWERTY',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'hjs');

/**
 * All this router does is redirect to the stage1 route and clear the
 * session data. So if you go to localhost:3000 it will redirect you
 * to localhost:3000/stage1
 */
app.get('/', function (req, res) {
    //Clear the user's session data
    req.session.destroy(function (err) {
        if (err) {
            console.error('Error destroying session:', err);
        }
    });

    res.redirect('stage1')
});

/**
 * This is called when someone visits localhost:3000/stage1 as a get request.
 * Most pages are viewed as a get request. This is the default for when someone
 * is linked to a page or types the URL in themselves.
 */
app.get('/stage1', function (req, res) {
    res.render('stage1'); //Just render the view with nothing special.
});

/**
 * Notice how this says `app.post` instead of `app.get`? That means
 * that this routing method is called when Express detects that the user
 * is viewig the page with post data. That means that the user has submitted
 * the form and there is data for us to validate.
 *
 * We'll check that the data is valid. If it is, we'll store it in the session,
 * otherwise we'll render `stage1.hjs` with an error message.
 */
app.post('/stage1', function (req, res) {
    //req.body contains all form data. Let's get it and store it into local vars
    var fullname = req.body.fullname;
    var email = req.body.email;

    //Check if either field has been left blank
    if (fullname === '' || email === '') {
        //One or both have been left blank
        //Render `stage1.hjs` with an error value now
        res.render('stage1', {
            error: 'You must fill in all fields.'
        });
    } else {
        //Both fields are filled
        //Set the session variables
        req.session.fullname = fullname;
        req.session.email = email;

        //Save the session data
        req.session.save(function (err) {
           if (err) {
               console.error('Error saving session', err);
           }
        });

        //Now redirect to the next stage
        res.redirect('stage2');
    }
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
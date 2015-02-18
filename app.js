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

//STAGE 1

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
        //Also pass in `fullname` and `email` so the user doesn't have to re-enter them.
        res.render('stage1', {
            error: 'You must fill in all fields.',
            fullname: fullname,
            email: email
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


//STAGE 2

/**
 * This is the get request for stage2. The first thing it will do
 * is check to see if the `fullname` and `email` session values
 * have been set. If they haven't then that means the user hasn't
 * gone through stage 1 yet, so we'll redirect them.
 */
app.get('/stage2', function (req, res) {
    //Check to see if the user has gone through stage 1
    if (!req.session.fullname || !req.session.email) {
        //They haven't so let's redirect them
        res.redirect('stage1');
    } else {
        res.render('stage2');
    }
});

/**
 * Pretty much the same idea as stage 1 post request. Check if the passwords
 * match and if they don't render the error, otherwise bring the user to the
 * 3rd stage.
 */
app.post('/stage2', function (req, res) {
    //Put the session vars into local ones
    var password1 = req.body.password1;
    var password2 = req.body.password2;

    //Check to see if they are blank or don't match
    if (password1 === '' || password1 !== password2) {
        //Show an error to the user
        res.render('stage2', {
            err: 'Your passwords must be nonblank and must match.'
        });
    } else {
        //Set and save the session
        req.session.password = password1;

        req.session.save(function (err) {
            if (err) {
                console.error('Error saving session', err);
            }
        });

        //Redirect to the 3rd stage
        res.redirect('stage3');
    }
});


//STAGE 3

/**
 * There is only a get router for the third stage since this is just displaying
 * data, not handling any form submissions.
 */
app.get('/stage3', function (req, res) {
    //Check to see if any of the session vars are empty
    if (!req.session.fullname || !req.session.email || !req.session.password) {
        //Redirect to stage 1 since they're missing stuff
        res.redirect('stage1');
    } else {
        //Display the data we've collected
        res.render('stage3', {
            fullname: req.session.fullname,
            email: req.session.email,
            password: req.session.password
        });
    }
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
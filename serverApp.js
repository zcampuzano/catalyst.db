// Set up
const express  = require('express');
const app      = express();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const router = express.Router(); // create our app w/ express
const mongoose = require('mongoose');                     // mongoose for mongodb
const morgan = require('morgan');             // log requests to the console (express4)
const bodyParser = require('body-parser');    // pull information from HTML POST (express4)
const methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
const cors = require('cors');
const config = require('./config/database');
const authentication = require('./routes/authenticationUser')(router, session);
const sportAuthentication = require('./routes/authenticationSport')(router, session);


// Configuration
//mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log('Could NOT connect to database: ', err);
    } else {
        console.log('Connected to database: ');
    }
});

app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());
app.use('/authentication', authentication);
app.use('/sportAuthentication', sportAuthentication);
app.use('/', include('./index.html'));

app.use(session({
    secret: config.secret,
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        url: config.uri,
        ttl: 3600*24
    })
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


console.log(mongoose.connection.readyState);

app.listen(process.env.PORT || 8080, function() {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
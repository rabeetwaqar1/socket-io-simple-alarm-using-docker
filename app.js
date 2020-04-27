let express = require('express');
let path = require('path');
let app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
let cookieParser = require('cookie-parser');
const createError = require('http-errors');
let logger = require('morgan');
let appName = "Calipsa Alarm System";

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

require('./routes/alarm')(app);

io.on('connection', (socket) => {
    global.io = socket;
});


app.get('/', (req, res) => {  
    res.render('index', {title: appName});
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// error handler
app.use((err, req, res, next) => {
    let data = {};
    let statusCode = err.statusCode || 500;

    data.message = err.message || 'Internal Server Error';

    if (process.env.NODE_ENV === 'development' && err.stack) {
        data.stack = err.stack;
    }

    if (parseInt(data.statusCode) >= 500) {
        console.error(err);
    }

    res.status(statusCode).json(data);
});

app.set('host', (process.env.HOST || 'localhost'));

// set port or the value set by environment let PORT
app.set('port', (process.env.PORT || 3000));


server.listen(app.get('port'), app.get('host'), () => {
    console.log("server is listening on port " + app.get('port') + "\nnode-version:", process.versions.node);
});

module.exports = app;

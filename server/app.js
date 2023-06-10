var createError = require('http-errors');
var express = require('express');
const mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

//DB
const dbURI = process.env.MONGO_URI;
const port = process.env.PORT || 5000;



var usersRouter = require('./routes/users');
const livreRouter = require('./routes/livres');
const queteRouter = require('./routes/quete');
const clubRouter = require('./routes/club');


var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});


//----------------------- Connecting to DB -----------------------------------------------//
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
  console.log('Connected to database');
  app.use('/livre', livreRouter);
  app.use('/quete', queteRouter);
  app.use('/club', clubRouter);


})
.catch((err) => {
  console.error('Error connecting to database', err);
});

//---------------- Server Listening -----------------------------//
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})



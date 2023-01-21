// var createError = require('http-errors');
// var path = require('path');
// var express = require('express');
// //var cookieParser = require('cookie-parser');
// var bodyParser = require("body-parser");
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var mealsRouter = require('./routes/meals');
// var ingredientsRouter = require('./routes/ingredients');
// var foodItemsRouter = require('./routes/foodItems');
// var dishesRouter = require('./routes/dishes');
// var inventoryRouter = require('./routes/inventory');
// var allergensRouter = require('./routes/allergens');
// var kitchenToolsRouter = require('./routes/kitchenTools')

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(bodyParser.json());
// //app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// // app.use('/', indexRouter);
// app.use('/api/meals', mealsRouter);
// app.use('/api/ingredients', ingredientsRouter);
// app.use('/api/foodItems', foodItemsRouter);
// app.use('/api/dishes', dishesRouter);
// app.use('/api/inventory', inventoryRouter);
// app.use('/api/allergens', allergensRouter);
// app.use('/api/kitchenTools', kitchenToolsRouter);

// const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/burn-logistics', { 
//   useNewUrlParser: true, 
//   useFindAndModify: false, 
//   useUnifiedTopology: true 
// });

// // if(process.env.NODE_ENV === 'production') {
//   // app.use(express.static('burn-logistics/build'));
// // }
// app.use(express.static('./build'));
// // urn-logistics/build'));
// // }
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;


var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var logger = require('morgan');
// const { auth, requiresAuth } = require('express-openid-connect');

// let userRouter = require('./routes/usersRegistration');
// let userLogin = require('./routes/usersLogin');
let usersRouter = require('./routes/users');
var indexRouter = require('./routes/index');
var mealsRouter = require('./routes/meals');
var ingredientsRouter = require('./routes/ingredients');
var foodItemsRouter = require('./routes/foodItems');
var dishesRouter = require('./routes/dishes');
var inventoryRouter = require('./routes/inventory');
var allergensRouter = require('./routes/allergens');
var kitchenToolsRouter = require('./routes/kitchenTools')
var authUsers = require('./routes/authUsers')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// const config = {
//   authRequired: false,
//   auth0Logout: true,
//   baseURL: 'http://localhost:3000',
//   clientID: 'YOUR_CLIENT_ID',
//   issuerBaseURL: 'https://YOUR_DOMAIN',
//   secret: 'LONG_RANDOM_STRING'
// };

// The `auth` router attaches /login, /logout
// and /callback routes to the baseURL
// app.use(auth(config));

// req.oidc.isAuthenticated is provided from the auth router
// app.get('/', (req, res) => {
//   res.send(
//     req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out'
//   )
// });

app.use('/', indexRouter);
// app.use('/api/user', userRouter);
// app.use('/api/userLogin', userLogin);
app.use('/api/users', usersRouter);
app.use('/api/meals', mealsRouter);
app.use('/api/ingredients', ingredientsRouter);
app.use('/api/foodItems', foodItemsRouter);
app.use('/api/dishes', dishesRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/allergens', allergensRouter);
app.use('/api/kitchenTools', kitchenToolsRouter);
app.use('/api/authUsers', authUsers);


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/burn-logistics', { 
  useNewUrlParser: true, 
  useFindAndModify: false, 
  useUnifiedTopology: true 
});
mongoose.set('useCreateIndex', true)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let wsMessage = require('./models/wsMessageModel');
wsMessage.watch().on('change', (data) => {
  console.log('wss.clients: ',app.locals.wss.clients);
  app.locals.wss.broadcast(data.fullDocument.body);
});


module.exports = app;
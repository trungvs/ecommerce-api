require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./controllers/users.controller'));
app.use('/profile', require('./controllers/profile.controller'))
app.use('/category', require('./controllers/category.controller'))
app.use('/banner', require('./controllers/banner.controller'))
app.use('/product', require('./controllers/product.controller'))
app.use('/home', require('./controllers/home.controllers'))
app.use('/cart', require('./controllers/cart.controllers'))
app.use('/order', require('./controllers/order.controllers'))

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? 8080 : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

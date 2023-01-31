const expressJwt = require('express-jwt');
const config = require('config.json');

module.exports = jwt;

function jwt() {
    const { secret } = config;
    return expressJwt({ secret , algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/users/checktoken',
            '/users/banner',
            '/users/signup',
            '/product/get',
            '/home',
            '/category/search',
            '/product/:url',
            {
                url: /^\/product\/.*/,
                methoad: ['GET']
            },
            '/cart',
            '/cart/addOrder',
            {
                url: /^\/order\/.*/,
                methoad: ['GET']
            },
        ]
    });
}

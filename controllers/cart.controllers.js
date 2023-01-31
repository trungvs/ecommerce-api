const express = require('express');
const router = express.Router();
const cartService = require('../services/cart.services');

router.post('/', getProductFromCart)
router.post('/addOrder', addOrder)
router.get('/getOrder', getOrderOfUser)
router.post('/getAllOrder', getAllOrder)

module.exports = router;

function getProductFromCart(req, res, next) {
    cartService.getProductFromCart(req, res)
}

function addOrder(req, res, next) {
    cartService.addOrder(req, res)
}

function getOrderOfUser(req, res, next) {
    cartService.getOrderOfUser(req, res)
}

function getAllOrder(req, res, next) {
    cartService.getAllOrder(req, res)
}